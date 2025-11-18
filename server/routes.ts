import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateQuestion, validateAnswer } from "./openai";
import { calculateAdaptiveDifficulty, updateUserDifficulty, type Subject } from "./adaptiveDifficulty";
import { 
  generateQuestionSchema, 
  validateAnswerSchema,
  insertPracticeSessionSchema,
  insertSessionQuestionSchema,
  users as usersTable,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "./db";
import { eq } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Practice session routes
  app.post("/api/practice-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body
      const validation = insertPracticeSessionSchema.safeParse({
        userId,
        subject: req.body.subject,
        yearLevel: req.body.yearLevel,
        questionsAttempted: 0,
        questionsCorrect: 0,
        pointsEarned: 0,
        duration: 0,
      });

      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request data", errors: validation.error });
      }

      const session = await storage.createPracticeSession(validation.data);
      res.json(session);
    } catch (error) {
      console.error("Error creating practice session:", error);
      res.status(500).json({ message: "Failed to create practice session" });
    }
  });

  app.get(
    "/api/practice-sessions/recent",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const sessions = await storage.getUserRecentSessions(userId, 5);
        res.json(sessions);
      } catch (error) {
        console.error("Error fetching recent sessions:", error);
        res.status(500).json({ message: "Failed to fetch recent sessions" });
      }
    }
  );

  app.get("/api/practice-sessions/all", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getUserAllSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching all sessions:", error);
      res.status(500).json({ message: "Failed to fetch all sessions" });
    }
  });

  app.post(
    "/api/practice-sessions/:id/complete",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const { id } = req.params;
        const userId = req.user.claims.sub;

        const session = await storage.getPracticeSession(id);
        if (!session || session.userId !== userId) {
          return res.status(404).json({ message: "Session not found" });
        }

        await storage.updatePracticeSession(id, {
          completedAt: new Date(),
        });

        // Update user stats
        await storage.updateUserStats(userId, session.pointsEarned || 0, new Date());

        // Re-fetch session to get final stats after all questions have been answered
        const updatedSession = await storage.getPracticeSession(id);
        
        // Update adaptive difficulty based on session performance
        const user = await storage.getUser(userId);
        if (user && updatedSession && updatedSession.questionsAttempted && updatedSession.questionsAttempted > 0) {
          // Get recent sessions AFTER marking this one complete
          const recentSessions = await storage.getUserRecentSessionsBySubject(
            userId,
            updatedSession.subject as Subject,
            10
          );
          
          const newDifficulty = calculateAdaptiveDifficulty(
            user,
            updatedSession.subject as Subject,
            recentSessions
          );
          
          // Calculate recent accuracy from last 5 completed sessions
          const last5 = recentSessions.slice(0, 5);
          const totalAttempted = last5.reduce((sum, s) => sum + (s.questionsAttempted || 0), 0);
          const totalCorrect = last5.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0);
          const sessionAccuracy = Math.round(
            ((updatedSession.questionsCorrect || 0) / updatedSession.questionsAttempted) * 100
          );
          const newAccuracy = totalAttempted > 0 
            ? Math.round((totalCorrect / totalAttempted) * 100)
            : sessionAccuracy;
          
          await updateUserDifficulty(
            userId,
            updatedSession.subject as Subject,
            newDifficulty,
            newAccuracy,
            storage
          );
        }

        // Check for achievements
        await storage.checkAndUnlockAchievements(userId);

        // Update pet experience if user has a pet
        const pet = await storage.getUserPet(userId);
        if (pet && session.pointsEarned) {
          const experienceGained = session.pointsEarned; // 1 point = 1 experience
          let remainingExp = (pet.experience || 0) + experienceGained;
          let currentLevel = pet.level || 1;
          const EXP_PER_LEVEL = 100; // Fixed 100 EXP per level

          // Handle multiple level-ups with a loop
          while (remainingExp >= EXP_PER_LEVEL) {
            currentLevel += 1;
            remainingExp -= EXP_PER_LEVEL;
          }
            
          await storage.updatePet(pet.id, {
            level: currentLevel,
            experience: remainingExp,
          });
        }

        res.json({ message: "Session completed successfully" });
      } catch (error) {
        console.error("Error completing session:", error);
        res.status(500).json({ message: "Failed to complete session" });
      }
    }
  );

  // Question generation routes
  app.post("/api/questions/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = generateQuestionSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request data", errors: validation.error });
      }

      const { subject, yearLevel, topic } = validation.data;
      
      // Get user and recent sessions for adaptive difficulty
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const recentSessions = await storage.getUserRecentSessionsBySubject(userId, subject as Subject, 10);
      
      // Always calculate adaptive difficulty server-side using fresh data
      const difficulty = calculateAdaptiveDifficulty(
        user,
        subject as Subject,
        recentSessions
      );
      
      // Generate question with adaptive difficulty
      let question;
      try {
        question = await generateQuestion(subject, yearLevel, topic, difficulty);
      } catch (error) {
        console.error("OpenAI generation error:", error);
        // Fallback to sample questions if OpenAI fails
        question = {
          question: subject === "maths" 
            ? `What is 5 + ${Math.floor(Math.random() * 10)}?`
            : "What is the past tense of 'run'?",
          correctAnswer: subject === "maths" 
            ? (5 + Math.floor(Math.random() * 10)).toString()
            : "ran",
          topic: subject === "maths" ? "addition" : "grammar",
          difficulty: difficulty,
        };
      }

      res.json({
        id: randomUUID(),
        ...question,
        adaptiveDifficulty: difficulty, // Return the adaptive difficulty level
      });
    } catch (error) {
      console.error("Error generating question:", error);
      res.status(500).json({ message: "Failed to generate question" });
    }
  });

  app.post("/api/questions/validate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      // Validate request body
      const validation = validateAnswerSchema.extend({
        sessionId: z.string(),
        questionId: z.string().optional(),
      }).safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request data", errors: validation.error });
      }

      const { sessionId, question, correctAnswer, userAnswer, subject } = validation.data;

      // Validate the session belongs to the user
      const session = await storage.getPracticeSession(sessionId);
      if (!session || session.userId !== userId) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Get AI feedback with error handling
      let result;
      try {
        result = await validateAnswer(question, correctAnswer, userAnswer, subject);
      } catch (error) {
        console.error("OpenAI validation error:", error);
        // Fallback to simple validation
        const isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        result = {
          isCorrect,
          feedback: isCorrect 
            ? "Great job! That's correct!" 
            : `Not quite. The correct answer is ${correctAnswer}. Keep trying!`
        };
      }

      // Save the question to the database
      await storage.createSessionQuestion({
        sessionId,
        question,
        correctAnswer,
        userAnswer,
        isCorrect: result.isCorrect,
        aiFeedback: result.feedback,
      });

      // Update session stats
      const pointsEarned = result.isCorrect ? 10 : 0;
      await storage.updatePracticeSession(sessionId, {
        questionsAttempted: (session.questionsAttempted || 0) + 1,
        questionsCorrect: (session.questionsCorrect || 0) + (result.isCorrect ? 1 : 0),
        pointsEarned: (session.pointsEarned || 0) + pointsEarned,
      });

      res.json(result);
    } catch (error) {
      console.error("Error validating answer:", error);
      res.status(500).json({ message: "Failed to validate answer" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Pet routes
  app.post("/api/pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { petType, name } = req.body;

      if (!petType || !name) {
        return res.status(400).json({ message: "Pet type and name are required" });
      }

      const validPetTypes = ["cat", "dog", "dragon", "robot", "owl", "fox"];
      if (!validPetTypes.includes(petType)) {
        return res.status(400).json({ message: "Invalid pet type" });
      }

      // Check if user already has a pet
      const existingPet = await storage.getUserPet(userId);
      if (existingPet) {
        return res.status(400).json({ message: "User already has a pet" });
      }

      const pet = await storage.createPet({
        userId,
        petType,
        name,
        level: 1,
        experience: 0,
        happiness: 100,
        hunger: 0,
      });

      res.json(pet);
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ message: "Failed to create pet" });
    }
  });

  app.get("/api/pets", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pet = await storage.getUserPet(userId);
      res.json(pet || null);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(500).json({ message: "Failed to fetch pet" });
    }
  });

  app.post("/api/pets/feed", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const foodCost = 50; // Cost to feed pet in points

      const result = await storage.feedPet(userId, foodCost);
      
      if (!result.success) {
        return res.status(400).json({ message: result.error });
      }

      res.json(result.pet);
    } catch (error) {
      console.error("Error feeding pet:", error);
      res.status(500).json({ message: "Failed to feed pet" });
    }
  });

  app.patch("/api/pets/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const petId = req.params.id;
      const updates = req.body;

      // Verify pet belongs to user
      const pet = await storage.getUserPet(userId);
      if (!pet || pet.id !== petId) {
        return res.status(404).json({ message: "Pet not found" });
      }

      await storage.updatePet(petId, updates);
      const updatedPet = await storage.getUserPet(userId);
      res.json(updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ message: "Failed to update pet" });
    }
  });

  // Parent/Teacher Dashboard routes
  app.post("/api/student-links", isAuthenticated, async (req: any, res) => {
    try {
      const supervisorId = req.user.claims.sub;
      const { studentId, relationship } = req.body;

      if (!studentId || !relationship) {
        return res.status(400).json({ message: "Student ID and relationship are required" });
      }

      if (relationship !== "parent" && relationship !== "teacher") {
        return res.status(400).json({ message: "Relationship must be 'parent' or 'teacher'" });
      }

      // Verify supervisor has correct role
      const supervisor = await storage.getUser(supervisorId);
      if (!supervisor) {
        return res.status(404).json({ message: "Supervisor not found" });
      }

      if (supervisor.role !== "parent" && supervisor.role !== "teacher") {
        return res.status(403).json({ 
          message: "Only parents and teachers can create student links" 
        });
      }

      // Verify target is a student
      const targetStudent = await storage.getUser(studentId);
      if (!targetStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      if (targetStudent.role !== "student") {
        return res.status(400).json({ 
          message: "Can only create links to users with student role" 
        });
      }

      const link = await storage.createStudentLink({
        supervisorId,
        studentId,
        relationship,
        approved: true, // Auto-approve for now (can add approval workflow later)
      });

      res.json(link);
    } catch (error) {
      console.error("Error creating student link:", error);
      res.status(500).json({ message: "Failed to create student link" });
    }
  });

  // Find student by email (for linking)
  app.get("/api/students/find", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { email } = req.query;
      
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email parameter is required" });
      }

      // Verify requester is parent or teacher
      const requester = await storage.getUser(userId);
      if (!requester || (requester.role !== "parent" && requester.role !== "teacher")) {
        return res.status(403).json({ 
          message: "Only parents and teachers can search for students" 
        });
      }

      // Find user by email
      const users = await db.select().from(usersTable).where(eq(usersTable.email, email));
      
      if (users.length === 0) {
        return res.status(404).json({ message: "Student not found with that email" });
      }

      const user = users[0];

      // Verify found user is a student
      if (user.role !== "student") {
        return res.status(404).json({ message: "User found is not a student" });
      }

      // Only return basic info for privacy
      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        yearLevel: user.yearLevel,
      });
    } catch (error) {
      console.error("Error finding student:", error);
      res.status(500).json({ message: "Failed to find student" });
    }
  });

  app.get("/api/student-links", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const links = await storage.getStudentLinks(userId);
      res.json(links);
    } catch (error) {
      console.error("Error fetching student links:", error);
      res.status(500).json({ message: "Failed to fetch student links" });
    }
  });

  app.patch("/api/student-links/:id/approve", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Get the link to verify ownership
      const links = await storage.getStudentLinks(userId);
      const linkToApprove = links.find(link => link.id === id);
      
      if (!linkToApprove) {
        return res.status(403).json({ 
          message: "Access denied. You can only approve links you own." 
        });
      }
      
      await storage.approveStudentLink(id);
      res.json({ message: "Student link approved successfully" });
    } catch (error) {
      console.error("Error approving student link:", error);
      res.status(500).json({ message: "Failed to approve student link" });
    }
  });

  app.delete("/api/student-links/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Get the link to verify ownership
      const links = await storage.getStudentLinks(userId);
      const linkToDelete = links.find(link => link.id === id);
      
      if (!linkToDelete) {
        return res.status(403).json({ 
          message: "Access denied. You can only delete links you own." 
        });
      }
      
      await storage.deleteStudentLink(id);
      res.json({ message: "Student link deleted successfully" });
    } catch (error) {
      console.error("Error deleting student link:", error);
      res.status(500).json({ message: "Failed to delete student link" });
    }
  });

  // Get aggregated stats for a student (for parent/teacher dashboard)
  app.get("/api/students/:studentId/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { studentId } = req.params;
      
      // Authorization: Check if user is the student themselves OR a linked supervisor
      const isOwnStats = userId === studentId;
      let isAuthorized = isOwnStats;
      
      if (!isOwnStats) {
        // Check if user is a linked supervisor with approved access
        const links = await storage.getStudentLinks(userId);
        isAuthorized = links.some(
          link => link.studentId === studentId && link.approved
        );
      }

      if (!isAuthorized) {
        return res.status(403).json({ 
          message: "Access denied. You must be linked to this student to view their stats." 
        });
      }
      
      // Get student user data
      const student = await storage.getUser(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Get all sessions for the student
      const sessions = await storage.getUserAllSessions(studentId);

      // Calculate subject-specific stats
      const mathsSessions = sessions.filter(s => s.subject === "maths" && s.completedAt);
      const englishSessions = sessions.filter(s => s.subject === "english" && s.completedAt);

      const mathsStats = {
        totalSessions: mathsSessions.length,
        totalQuestions: mathsSessions.reduce((sum, s) => sum + (s.questionsAttempted || 0), 0),
        correctAnswers: mathsSessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0),
        accuracy: 0,
        difficulty: student.mathsDifficulty,
      };

      if (mathsStats.totalQuestions > 0) {
        mathsStats.accuracy = Math.round((mathsStats.correctAnswers / mathsStats.totalQuestions) * 100);
      }

      const englishStats = {
        totalSessions: englishSessions.length,
        totalQuestions: englishSessions.reduce((sum, s) => sum + (s.questionsAttempted || 0), 0),
        correctAnswers: englishSessions.reduce((sum, s) => sum + (s.questionsCorrect || 0), 0),
        accuracy: 0,
        difficulty: student.englishDifficulty,
      };

      if (englishStats.totalQuestions > 0) {
        englishStats.accuracy = Math.round((englishStats.correctAnswers / englishStats.totalQuestions) * 100);
      }

      res.json({
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          yearLevel: student.yearLevel,
          totalPoints: student.totalPoints,
          currentStreak: student.currentStreak,
          longestStreak: student.longestStreak,
        },
        maths: mathsStats,
        english: englishStats,
        recentSessions: sessions.slice(0, 10),
      });
    } catch (error) {
      console.error("Error fetching student stats:", error);
      res.status(500).json({ message: "Failed to fetch student stats" });
    }
  });

  // Story/Adventure routes
  app.get("/api/stories", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const stories = await storage.getActiveStories();
      const userProgress = await storage.getUserAllStoryProgress(userId);

      // Enrich stories with user progress
      const enrichedStories = stories.map(story => {
        const progress = userProgress.find(p => p.storyId === story.id);
        return {
          ...story,
          userProgress: progress || null,
        };
      });

      res.json(enrichedStories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;

      const story = await storage.getStory(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      const chapters = await storage.getStoryChapters(id);
      const progress = await storage.getUserStoryProgress(userId, id);

      res.json({
        ...story,
        chapters,
        userProgress: progress || null,
      });
    } catch (error) {
      console.error("Error fetching story details:", error);
      res.status(500).json({ message: "Failed to fetch story details" });
    }
  });

  app.post("/api/stories/:storyId/start", isAuthenticated, async (req: any, res) => {
    try {
      const { storyId } = req.params;
      const userId = req.user.claims.sub;

      // Check if story exists
      const story = await storage.getStory(storyId);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }

      // Check if user already has progress
      const existingProgress = await storage.getUserStoryProgress(userId, storyId);
      if (existingProgress) {
        return res.json(existingProgress);
      }

      // Create new progress
      const progress = await storage.createStoryProgress({
        userId,
        storyId,
        currentChapter: 1,
        completedChapters: [],
        questionsCompleted: 0,
        isCompleted: false,
      });

      res.json(progress);
    } catch (error) {
      console.error("Error starting story:", error);
      res.status(500).json({ message: "Failed to start story" });
    }
  });

  app.post("/api/stories/:storyId/chapters/:chapterNumber/complete", isAuthenticated, async (req: any, res) => {
    try {
      const { storyId, chapterNumber } = req.params;
      const userId = req.user.claims.sub;

      const chapter = (await storage.getStoryChapters(storyId)).find(
        c => c.chapterNumber === parseInt(chapterNumber)
      );
      
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }

      // Check if user has completed required questions
      const progress = await storage.getUserStoryProgress(userId, storyId);
      if (!progress) {
        return res.status(400).json({ message: "Story not started" });
      }

      if ((progress.questionsCompleted || 0) < (chapter.requiredQuestions || 5)) {
        return res.status(400).json({ 
          message: "Not enough questions completed",
          required: chapter.requiredQuestions,
          completed: progress.questionsCompleted,
        });
      }

      // Complete the chapter
      const result = await storage.completeChapter(userId, storyId, parseInt(chapterNumber));

      // Award bonus points for chapter completion
      if (result.completed && chapter.rewardPoints) {
        const user = await storage.getUser(userId);
        if (user) {
          await storage.updateUser(userId, {
            totalPoints: (user.totalPoints || 0) + chapter.rewardPoints,
          });
        }
      }

      res.json({
        ...result,
        rewardPoints: chapter.rewardPoints,
      });
    } catch (error) {
      console.error("Error completing chapter:", error);
      res.status(500).json({ message: "Failed to complete chapter" });
    }
  });

  app.post("/api/stories/:storyId/record-question", isAuthenticated, async (req: any, res) => {
    try {
      const { storyId } = req.params;
      const userId = req.user.claims.sub;

      await storage.recordStoryQuestion(userId, storyId);
      const progress = await storage.getUserStoryProgress(userId, storyId);

      res.json(progress);
    } catch (error) {
      console.error("Error recording story question:", error);
      res.status(500).json({ message: "Failed to record question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
