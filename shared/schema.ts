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
  role: varchar("role").default("student"), // "student", "parent", "teacher"
  yearLevel: integer("year_level").default(1), // NZ curriculum Years 1-8 (for students only)
  totalPoints: integer("total_points").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastPracticeDate: timestamp("last_practice_date"),
  // Adaptive difficulty tracking
  mathsDifficulty: varchar("maths_difficulty").default("medium"), // "easy", "medium", "hard"
  englishDifficulty: varchar("english_difficulty").default("medium"),
  mathsAccuracyRecent: integer("maths_accuracy_recent").default(50), // percentage 0-100
  englishAccuracyRecent: integer("english_accuracy_recent").default(50),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  practiceSessions: many(practiceSessions),
  achievements: many(userAchievements),
  pet: one(pets),
  storyProgress: many(userStoryProgress),
  // For parents/teachers: students they supervise
  supervisedStudents: many(studentLinks, { relationName: "supervisor" }),
  // For students: supervisors monitoring them
  supervisors: many(studentLinks, { relationName: "student" }),
}));

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

// Pets table - virtual companions that grow with learning
export const pets = pgTable("pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  petType: varchar("pet_type").notNull(), // "cat", "dog", "dragon", "robot", "owl", "fox"
  name: varchar("name").notNull(),
  level: integer("level").default(1),
  experience: integer("experience").default(0), // Points toward next level
  happiness: integer("happiness").default(100), // 0-100
  hunger: integer("hunger").default(0), // 0-100 (higher = more hungry)
  lastFed: timestamp("last_fed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const petsRelations = relations(pets, ({ one }) => ({
  user: one(users, {
    fields: [pets.userId],
    references: [users.id],
  }),
}));

export const insertPetSchema = createInsertSchema(pets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;

// Stories table - narrative-driven learning adventures
export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  subject: varchar("subject").notNull(), // "maths", "english", or "both"
  minYearLevel: integer("min_year_level").default(1),
  maxYearLevel: integer("max_year_level").default(8),
  difficulty: varchar("difficulty").default("medium"), // "easy", "medium", "hard"
  imageUrl: varchar("image_url"),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0), // Display order
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storiesRelations = relations(stories, ({ many }) => ({
  chapters: many(chapters),
  userProgress: many(userStoryProgress),
}));

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;

// Chapters table - individual chapters within stories
export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id")
    .notNull()
    .references(() => stories.id, { onDelete: "cascade" }),
  chapterNumber: integer("chapter_number").notNull(),
  title: varchar("title").notNull(),
  narrative: text("narrative").notNull(), // Story text shown to user
  objectiveDescription: text("objective_description").notNull(), // What user needs to do
  requiredQuestions: integer("required_questions").default(5), // Questions to complete
  subject: varchar("subject").notNull(), // "maths" or "english"
  difficulty: varchar("difficulty").default("medium"),
  rewardPoints: integer("reward_points").default(50), // Bonus points for completing
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chaptersRelations = relations(chapters, ({ one }) => ({
  story: one(stories, {
    fields: [chapters.storyId],
    references: [stories.id],
  }),
}));

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Chapter = typeof chapters.$inferSelect;
export type InsertChapter = z.infer<typeof insertChapterSchema>;

// User story progress table - tracks user progress through stories
export const userStoryProgress = pgTable("user_story_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  storyId: varchar("story_id")
    .notNull()
    .references(() => stories.id, { onDelete: "cascade" }),
  currentChapter: integer("current_chapter").default(1),
  completedChapters: integer("completed_chapters").array().default(sql`ARRAY[]::integer[]`), // Array of completed chapter numbers
  questionsCompleted: integer("questions_completed").default(0), // For current chapter
  isCompleted: boolean("is_completed").default(false),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userStoryProgressRelations = relations(userStoryProgress, ({ one }) => ({
  user: one(users, {
    fields: [userStoryProgress.userId],
    references: [users.id],
  }),
  story: one(stories, {
    fields: [userStoryProgress.storyId],
    references: [stories.id],
  }),
}));

export const insertUserStoryProgressSchema = createInsertSchema(userStoryProgress).omit({
  id: true,
  startedAt: true,
  updatedAt: true,
});

export type UserStoryProgress = typeof userStoryProgress.$inferSelect;
export type InsertUserStoryProgress = z.infer<typeof insertUserStoryProgressSchema>;

// Student links table - connects students to parents/teachers
export const studentLinks = pgTable("student_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supervisorId: varchar("supervisor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // parent or teacher
  studentId: varchar("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  relationship: varchar("relationship").notNull(), // "parent" or "teacher"
  approved: boolean("approved").default(false), // requires student/parent approval
  createdAt: timestamp("created_at").defaultNow(),
});

export const studentLinksRelations = relations(studentLinks, ({ one }) => ({
  supervisor: one(users, {
    fields: [studentLinks.supervisorId],
    references: [users.id],
    relationName: "supervisor",
  }),
  student: one(users, {
    fields: [studentLinks.studentId],
    references: [users.id],
    relationName: "student",
  }),
}));

export const insertStudentLinkSchema = createInsertSchema(studentLinks).omit({
  id: true,
  createdAt: true,
});

export type StudentLink = typeof studentLinks.$inferSelect;
export type InsertStudentLink = z.infer<typeof insertStudentLinkSchema>;

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
