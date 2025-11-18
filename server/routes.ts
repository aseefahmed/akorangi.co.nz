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
} from "@shared/schema";
import { randomUUID } from "crypto";
import { z } from "zod";

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

  const httpServer = createServer(app);
  return httpServer;
}
