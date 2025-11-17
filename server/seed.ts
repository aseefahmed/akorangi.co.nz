import { db } from "./db";
import { achievements } from "@shared/schema";
import { eq } from "drizzle-orm";

const initialAchievements = [
  {
    name: "First Steps",
    description: "Complete your first practice session",
    icon: "🌟",
    category: "practice",
    requirement: 10,
  },
  {
    name: "Quick Learner",
    description: "Earn 50 points",
    icon: "⚡",
    category: "practice",
    requirement: 50,
  },
  {
    name: "Rising Star",
    description: "Earn 100 points",
    icon: "⭐",
    category: "practice",
    requirement: 100,
  },
  {
    name: "Super Student",
    description: "Earn 250 points",
    icon: "💫",
    category: "practice",
    requirement: 250,
  },
  {
    name: "Champion Learner",
    description: "Earn 500 points",
    icon: "👑",
    category: "practice",
    requirement: 500,
  },
  {
    name: "On Fire!",
    description: "Practice for 3 days in a row",
    icon: "🔥",
    category: "streak",
    requirement: 3,
  },
  {
    name: "Week Warrior",
    description: "Practice for 7 days in a row",
    icon: "💪",
    category: "streak",
    requirement: 7,
  },
  {
    name: "Dedication Master",
    description: "Practice for 14 days in a row",
    icon: "🎯",
    category: "streak",
    requirement: 14,
  },
];

async function seed() {
  console.log("Seeding database with initial achievements...");

  for (const achievement of initialAchievements) {
    // Check if achievement already exists
    const existing = await db
      .select()
      .from(achievements)
      .where(eq(achievements.name, achievement.name));

    if (existing.length === 0) {
      await db.insert(achievements).values(achievement);
      console.log(`✓ Added achievement: ${achievement.name}`);
    } else {
      console.log(`- Achievement already exists: ${achievement.name}`);
    }
  }

  console.log("Database seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
