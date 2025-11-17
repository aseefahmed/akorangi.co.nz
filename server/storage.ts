import {
  users,
  practiceSessions,
  sessionQuestions,
  achievements,
  userAchievements,
  type User,
  type UpsertUser,
  type PracticeSession,
  type InsertPracticeSession,
  type SessionQuestion,
  type InsertSessionQuestion,
  type Achievement,
  type UserAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
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
}

export const storage = new DatabaseStorage();
