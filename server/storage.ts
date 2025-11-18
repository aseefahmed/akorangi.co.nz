import {
  users,
  practiceSessions,
  sessionQuestions,
  achievements,
  userAchievements,
  studentLinks,
  pets,
  type User,
  type UpsertUser,
  type PracticeSession,
  type InsertPracticeSession,
  type SessionQuestion,
  type InsertSessionQuestion,
  type Achievement,
  type UserAchievement,
  type StudentLink,
  type InsertStudentLink,
  type Pet,
  type InsertPet,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  updateUserStats(
    userId: string,
    pointsEarned: number,
    practiceDate: Date
  ): Promise<void>;

  // Practice session operations
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  getPracticeSession(id: string): Promise<PracticeSession | undefined>;
  updatePracticeSession(
    id: string,
    updates: Partial<PracticeSession>
  ): Promise<void>;
  getUserRecentSessions(userId: string, limit?: number): Promise<PracticeSession[]>;
  getUserRecentSessionsBySubject(userId: string, subject: string, limit?: number): Promise<PracticeSession[]>;
  getUserAllSessions(userId: string): Promise<PracticeSession[]>;

  // Session question operations
  createSessionQuestion(question: InsertSessionQuestion): Promise<SessionQuestion>;
  updateSessionQuestion(
    id: string,
    updates: Partial<SessionQuestion>
  ): Promise<void>;

  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievementId: string): Promise<void>;
  checkAndUnlockAchievements(userId: string): Promise<void>;

  // Student link operations
  createStudentLink(link: InsertStudentLink): Promise<StudentLink>;
  getStudentLinks(supervisorId: string): Promise<(StudentLink & { student: User })[]>;
  approveStudentLink(linkId: string): Promise<void>;
  deleteStudentLink(linkId: string): Promise<void>;

  // Pet operations
  createPet(pet: InsertPet): Promise<Pet>;
  getUserPet(userId: string): Promise<Pet | undefined>;
  updatePet(petId: string, updates: Partial<Pet>): Promise<void>;
  feedPet(userId: string, foodCost: number): Promise<{ success: boolean; pet?: Pet; error?: string }>;
  updatePetHunger(): Promise<void>; // Called periodically to increase hunger
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async updateUserStats(
    userId: string,
    pointsEarned: number,
    practiceDate: Date
  ): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const lastPractice = user.lastPracticeDate;
    const today = new Date(practiceDate);
    today.setHours(0, 0, 0, 0);

    let newStreak = user.currentStreak || 0;

    if (lastPractice) {
      const lastDate = new Date(lastPractice);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const newLongestStreak = Math.max(user.longestStreak || 0, newStreak);

    await db
      .update(users)
      .set({
        totalPoints: (user.totalPoints || 0) + pointsEarned,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastPracticeDate: practiceDate,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Practice session operations
  async createPracticeSession(
    sessionData: InsertPracticeSession
  ): Promise<PracticeSession> {
    const [session] = await db
      .insert(practiceSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async getPracticeSession(id: string): Promise<PracticeSession | undefined> {
    const [session] = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.id, id));
    return session;
  }

  async updatePracticeSession(
    id: string,
    updates: Partial<PracticeSession>
  ): Promise<void> {
    await db
      .update(practiceSessions)
      .set(updates)
      .where(eq(practiceSessions.id, id));
  }

  async getUserRecentSessions(
    userId: string,
    limit: number = 5
  ): Promise<PracticeSession[]> {
    const sessions = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.createdAt))
      .limit(limit);
    return sessions;
  }

  async getUserRecentSessionsBySubject(
    userId: string,
    subject: string,
    limit: number = 10
  ): Promise<PracticeSession[]> {
    const sessions = await db
      .select()
      .from(practiceSessions)
      .where(
        and(
          eq(practiceSessions.userId, userId),
          eq(practiceSessions.subject, subject)
        )
      )
      .orderBy(desc(practiceSessions.createdAt))
      .limit(limit);
    return sessions;
  }

  async getUserAllSessions(userId: string): Promise<PracticeSession[]> {
    const sessions = await db
      .select()
      .from(practiceSessions)
      .where(eq(practiceSessions.userId, userId))
      .orderBy(desc(practiceSessions.createdAt));
    return sessions;
  }

  // Session question operations
  async createSessionQuestion(
    questionData: InsertSessionQuestion
  ): Promise<SessionQuestion> {
    const [question] = await db
      .insert(sessionQuestions)
      .values(questionData)
      .returning();
    return question;
  }

  async updateSessionQuestion(
    id: string,
    updates: Partial<SessionQuestion>
  ): Promise<void> {
    await db
      .update(sessionQuestions)
      .set(updates)
      .where(eq(sessionQuestions.id, id));
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const userAchs = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));

    // Fetch achievement details for each
    const achsWithDetails = await Promise.all(
      userAchs.map(async (userAch) => {
        const [achievement] = await db
          .select()
          .from(achievements)
          .where(eq(achievements.id, userAch.achievementId));
        return {
          ...userAch,
          achievement,
        };
      })
    );

    return achsWithDetails as any;
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    // Check if already unlocked
    const existing = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        )
      );

    if (existing.length === 0) {
      await db.insert(userAchievements).values({
        userId,
        achievementId,
      });
    }
  }

  async checkAndUnlockAchievements(userId: string): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) return;

    const allAchievements = await this.getAchievements();

    for (const achievement of allAchievements) {
      let shouldUnlock = false;

      switch (achievement.category) {
        case "streak":
          if ((user.currentStreak || 0) >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;
        case "practice":
          if ((user.totalPoints || 0) >= achievement.requirement) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
      }
    }
  }

  // Student link operations
  async createStudentLink(linkData: InsertStudentLink): Promise<StudentLink> {
    const [link] = await db.insert(studentLinks).values(linkData).returning();
    return link;
  }

  async getStudentLinks(supervisorId: string): Promise<(StudentLink & { student: User })[]> {
    const links = await db
      .select()
      .from(studentLinks)
      .where(eq(studentLinks.supervisorId, supervisorId))
      .orderBy(desc(studentLinks.createdAt));

    // Fetch student details for each link
    const linksWithStudents = await Promise.all(
      links.map(async (link) => {
        const [student] = await db
          .select()
          .from(users)
          .where(eq(users.id, link.studentId));
        return {
          ...link,
          student,
        };
      })
    );

    return linksWithStudents;
  }

  async approveStudentLink(linkId: string): Promise<void> {
    await db
      .update(studentLinks)
      .set({ approved: true })
      .where(eq(studentLinks.id, linkId));
  }

  async deleteStudentLink(linkId: string): Promise<void> {
    await db.delete(studentLinks).where(eq(studentLinks.id, linkId));
  }

  // Pet operations
  async createPet(petData: InsertPet): Promise<Pet> {
    const [pet] = await db.insert(pets).values(petData).returning();
    return pet;
  }

  async getUserPet(userId: string): Promise<Pet | undefined> {
    const [pet] = await db.select().from(pets).where(eq(pets.userId, userId));
    return pet;
  }

  async updatePet(petId: string, updates: Partial<Pet>): Promise<void> {
    await db
      .update(pets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(pets.id, petId));
  }

  async feedPet(userId: string, foodCost: number): Promise<{ success: boolean; pet?: Pet; error?: string }> {
    const user = await this.getUser(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const userPoints = user.totalPoints ?? 0;
    if (userPoints < foodCost) {
      return { success: false, error: "Not enough points to feed pet" };
    }

    const pet = await this.getUserPet(userId);
    if (!pet) {
      return { success: false, error: "Pet not found" };
    }

    // Deduct points from user
    await this.updateUser(userId, {
      totalPoints: userPoints - foodCost,
    });

    // Update pet stats
    const currentHappiness = pet.happiness ?? 100;
    const currentHunger = pet.hunger ?? 0;
    const newHappiness = Math.min(100, currentHappiness + 20);
    const newHunger = Math.max(0, currentHunger - 30);

    await this.updatePet(pet.id, {
      happiness: newHappiness,
      hunger: newHunger,
      lastFed: new Date(),
    });

    const updatedPet = await this.getUserPet(userId);
    return { success: true, pet: updatedPet };
  }

  async updatePetHunger(): Promise<void> {
    // Get all pets
    const allPets = await db.select().from(pets);
    
    for (const pet of allPets) {
      const hoursSinceLastFed = pet.lastFed
        ? (Date.now() - pet.lastFed.getTime()) / (1000 * 60 * 60)
        : 24;

      // Increase hunger by 5 per hour, decrease happiness if very hungry
      const hungerIncrease = Math.floor(hoursSinceLastFed * 5);
      const currentHunger = pet.hunger ?? 0;
      const currentHappiness = pet.happiness ?? 100;
      const newHunger = Math.min(100, currentHunger + hungerIncrease);
      const newHappiness = newHunger > 80 ? Math.max(0, currentHappiness - 10) : currentHappiness;

      if (hungerIncrease > 0) {
        await this.updatePet(pet.id, {
          hunger: newHunger,
          happiness: newHappiness,
        });
      }
    }
  }
}

export const storage = new DatabaseStorage();
