import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  jsonb,
  index,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  yearLevel: integer("year_level").default(1), // NZ curriculum Years 1-8
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastPracticeDate: timestamp("last_practice_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  practiceSessions: many(practiceSessions),
  achievements: many(userAchievements),
}));

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

// Practice sessions table
export const practiceSessions = pgTable("practice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: varchar("subject").notNull(), // "maths" or "english"
  yearLevel: integer("year_level").notNull(),
  questionsAttempted: integer("questions_attempted").default(0),
  questionsCorrect: integer("questions_correct").default(0),
  pointsEarned: integer("points_earned").default(0),
  duration: integer("duration").default(0), // in seconds
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const practiceSessionsRelations = relations(
  practiceSessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [practiceSessions.userId],
      references: [users.id],
    }),
    questions: many(sessionQuestions),
  })
);

export const insertPracticeSessionSchema = createInsertSchema(practiceSessions).omit({
  id: true,
  createdAt: true,
});

export type PracticeSession = typeof practiceSessions.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;

// Session questions table - stores individual questions within a practice session
export const sessionQuestions = pgTable("session_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id")
    .notNull()
    .references(() => practiceSessions.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  aiFeedback: text("ai_feedback"),
  topic: varchar("topic"), // e.g., "addition", "reading comprehension"
  difficulty: varchar("difficulty"), // "easy", "medium", "hard"
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessionQuestionsRelations = relations(sessionQuestions, ({ one }) => ({
  session: one(practiceSessions, {
    fields: [sessionQuestions.sessionId],
    references: [practiceSessions.id],
  }),
}));

export const insertSessionQuestionSchema = createInsertSchema(sessionQuestions).omit({
  id: true,
  createdAt: true,
});

export type SessionQuestion = typeof sessionQuestions.$inferSelect;
export type InsertSessionQuestion = z.infer<typeof insertSessionQuestionSchema>;

// Achievements table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(), // emoji or icon name
  category: varchar("category").notNull(), // "streak", "accuracy", "practice", "mastery"
  requirement: integer("requirement").notNull(), // threshold to unlock
});

export type Achievement = typeof achievements.$inferSelect;

// User achievements table
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementId: varchar("achievement_id")
    .notNull()
    .references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export type UserAchievement = typeof userAchievements.$inferSelect;

// Question generation request schema
export const generateQuestionSchema = z.object({
  subject: z.enum(["maths", "english"]),
  yearLevel: z.number().min(1).max(8),
  topic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

export type GenerateQuestionRequest = z.infer<typeof generateQuestionSchema>;

// Answer validation request schema
export const validateAnswerSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  userAnswer: z.string(),
  subject: z.enum(["maths", "english"]),
});

export type ValidateAnswerRequest = z.infer<typeof validateAnswerSchema>;
