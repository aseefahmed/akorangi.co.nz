import { db } from "./db";
import { achievements, stories, chapters } from "@shared/schema";
import { eq } from "drizzle-orm";

const initialAchievements = [
  {
    name: "First Steps",
    description: "Complete your first practice session",
    icon: "Sparkles",
    category: "practice",
    requirement: 10,
  },
  {
    name: "Quick Learner",
    description: "Earn 50 points",
    icon: "Zap",
    category: "practice",
    requirement: 50,
  },
  {
    name: "Rising Star",
    description: "Earn 100 points",
    icon: "Star",
    category: "practice",
    requirement: 100,
  },
  {
    name: "Super Student",
    description: "Earn 250 points",
    icon: "Sparkles",
    category: "practice",
    requirement: 250,
  },
  {
    name: "Champion Learner",
    description: "Earn 500 points",
    icon: "Crown",
    category: "practice",
    requirement: 500,
  },
  {
    name: "On Fire!",
    description: "Practice for 3 days in a row",
    icon: "Flame",
    category: "streak",
    requirement: 3,
  },
  {
    name: "Week Warrior",
    description: "Practice for 7 days in a row",
    icon: "Target",
    category: "streak",
    requirement: 7,
  },
  {
    name: "Dedication Master",
    description: "Practice for 14 days in a row",
    icon: "Trophy",
    category: "streak",
    requirement: 14,
  },
  {
    name: "Story Starter",
    description: "Complete your first story chapter",
    icon: "BookOpen",
    category: "story",
    requirement: 1,
  },
  {
    name: "Adventure Complete",
    description: "Complete your first full story adventure",
    icon: "Trophy",
    category: "story",
    requirement: 1,
  },
  {
    name: "Master Explorer",
    description: "Complete 3 different story adventures",
    icon: "Map",
    category: "story",
    requirement: 3,
  },
  {
    name: "Story Legend",
    description: "Complete all story adventures",
    icon: "Crown",
    category: "story",
    requirement: 5,
  },
];

const initialStories = [
  {
    title: "The Kiwi Quest",
    description: "Join Tama the kiwi on an exciting adventure through New Zealand forests! Help Tama find their way home by solving maths problems and answering questions about nature.",
    subject: "maths",
    minYearLevel: 1,
    maxYearLevel: 4,
    difficulty: "easy",
    order: 1,
    isActive: true,
  },
  {
    title: "Adventure at Milford Sound",
    description: "Explore the stunning Milford Sound and help the local wildlife! Use your English skills to communicate with animals and solve mysteries in this beautiful fiordland.",
    subject: "english",
    minYearLevel: 2,
    maxYearLevel: 5,
    difficulty: "easy",
    order: 2,
    isActive: true,
  },
  {
    title: "Auckland Sky Tower Challenge",
    description: "Race to the top of the Sky Tower! Solve maths puzzles at each level to help the maintenance team fix problems and reach the observation deck.",
    subject: "maths",
    minYearLevel: 3,
    maxYearLevel: 6,
    difficulty: "medium",
    order: 3,
    isActive: true,
  },
  {
    title: "The Great Pohutukawa Mystery",
    description: "A magical pohutukawa tree needs your help! Use your reading and writing skills to decode ancient messages and save the Christmas tree from a mysterious illness.",
    subject: "english",
    minYearLevel: 4,
    maxYearLevel: 7,
    difficulty: "medium",
    order: 4,
    isActive: true,
  },
  {
    title: "Rotorua Geothermal Adventure",
    description: "Become a geothermal scientist! Help researchers study Rotorua's bubbling mud pools and geysers by measuring temperatures, distances, and solving mathematical patterns.",
    subject: "maths",
    minYearLevel: 5,
    maxYearLevel: 8,
    difficulty: "hard",
    order: 5,
    isActive: true,
  },
];

const storyChapters = {
  "The Kiwi Quest": [
    {
      chapterNumber: 1,
      title: "Lost in the Forest",
      narrative: "Tama the kiwi woke up in an unfamiliar part of the forest. The sun was setting, and Tama needed to count the trees to figure out which path leads home. Can you help count?",
      objectiveDescription: "Help Tama count trees and solve addition problems to find the right path.",
      requiredQuestions: 5,
      subject: "maths",
      difficulty: "easy",
      rewardPoints: 25,
    },
    {
      chapterNumber: 2,
      title: "Crossing the Stream",
      narrative: "Tama found the path! But there's a stream blocking the way. To build a bridge, Tama needs to collect exactly the right number of sticks. Time to practice subtraction!",
      objectiveDescription: "Solve subtraction problems to help Tama gather the correct number of sticks.",
      requiredQuestions: 5,
      subject: "maths",
      difficulty: "easy",
      rewardPoints: 25,
    },
    {
      chapterNumber: 3,
      title: "Home Sweet Home",
      narrative: "The bridge is complete! Tama can see home in the distance. But first, Tama needs to share food equally with friends. Let's practice sharing!",
      objectiveDescription: "Help Tama share food by solving division and multiplication problems.",
      requiredQuestions: 5,
      subject: "maths",
      difficulty: "easy",
      rewardPoints: 50,
    },
  ],
  "Adventure at Milford Sound": [
    {
      chapterNumber: 1,
      title: "Meeting the Dolphins",
      narrative: "You've arrived at beautiful Milford Sound! A pod of dolphins is trying to tell you something. Practice your reading to understand their message.",
      objectiveDescription: "Read passages and answer comprehension questions to communicate with dolphins.",
      requiredQuestions: 5,
      subject: "english",
      difficulty: "easy",
      rewardPoints: 25,
    },
    {
      chapterNumber: 2,
      title: "The Waterfall Riddle",
      narrative: "The dolphins led you to a massive waterfall. There's writing in the mist! You need to use proper grammar to decode the secret message.",
      objectiveDescription: "Answer grammar questions to decode the waterfall's message.",
      requiredQuestions: 5,
      subject: "english",
      difficulty: "easy",
      rewardPoints: 25,
    },
    {
      chapterNumber: 3,
      title: "Saving the Seals",
      narrative: "The message revealed that baby seals need help! Write clear instructions to guide the seals safely to their parents.",
      objectiveDescription: "Practice writing skills by creating instructions and descriptions.",
      requiredQuestions: 5,
      subject: "english",
      difficulty: "easy",
      rewardPoints: 50,
    },
  ],
  "Auckland Sky Tower Challenge": [
    {
      chapterNumber: 1,
      title: "Ground Floor Problems",
      narrative: "The Sky Tower lift is broken! You're part of the repair team. Start by calculating measurements at the ground floor to fix the first set of gears.",
      objectiveDescription: "Solve measurement and calculation problems to repair the lift.",
      requiredQuestions: 6,
      subject: "maths",
      difficulty: "medium",
      rewardPoints: 30,
    },
    {
      chapterNumber: 2,
      title: "Halfway Up",
      narrative: "Great work! The lift is moving. You're now 186 metres up! Calculate patterns in the building's structure to keep going higher.",
      objectiveDescription: "Identify and complete mathematical patterns and sequences.",
      requiredQuestions: 6,
      subject: "maths",
      difficulty: "medium",
      rewardPoints: 30,
    },
    {
      chapterNumber: 3,
      title: "Top of Auckland",
      narrative: "You've reached 328 metres! From up here, you can see all of Auckland. Solve geometry problems to align the observation deck's telescope.",
      objectiveDescription: "Practice geometry and measurement to complete the mission.",
      requiredQuestions: 6,
      subject: "maths",
      difficulty: "medium",
      rewardPoints: 60,
    },
  ],
  "The Great Pohutukawa Mystery": [
    {
      chapterNumber: 1,
      title: "The Wilting Tree",
      narrative: "The ancient pohutukawa tree on the beach is wilting! Read the botanical journal to discover what might be wrong.",
      objectiveDescription: "Read complex passages and answer detailed comprehension questions.",
      requiredQuestions: 6,
      subject: "english",
      difficulty: "medium",
      rewardPoints: 30,
    },
    {
      chapterNumber: 2,
      title: "Decoding the Runes",
      narrative: "You found mysterious carvings in the tree's bark! Use your knowledge of word structure and vocabulary to decode them.",
      objectiveDescription: "Answer vocabulary and word structure questions.",
      requiredQuestions: 6,
      subject: "english",
      difficulty: "medium",
      rewardPoints: 30,
    },
    {
      chapterNumber: 3,
      title: "The Healing Spell",
      narrative: "The runes revealed a healing ritual! Write a persuasive letter to convince the community to help save the tree.",
      objectiveDescription: "Demonstrate advanced writing skills with persuasive text.",
      requiredQuestions: 6,
      subject: "english",
      difficulty: "medium",
      rewardPoints: 60,
    },
  ],
  "Rotorua Geothermal Adventure": [
    {
      chapterNumber: 1,
      title: "Temperature Measurements",
      narrative: "Welcome to the Rotorua geothermal research station! Your first task is to measure and compare temperatures across different thermal areas.",
      objectiveDescription: "Solve problems involving decimals, fractions, and temperature calculations.",
      requiredQuestions: 7,
      subject: "maths",
      difficulty: "hard",
      rewardPoints: 40,
    },
    {
      chapterNumber: 2,
      title: "Geyser Predictions",
      narrative: "Incredible! Now predict when the next geyser eruption will occur by analyzing patterns in the data you collected.",
      objectiveDescription: "Work with advanced patterns, ratios, and time calculations.",
      requiredQuestions: 7,
      subject: "maths",
      difficulty: "hard",
      rewardPoints: 40,
    },
    {
      chapterNumber: 3,
      title: "The Scientific Report",
      narrative: "You've gathered all the data! Create mathematical graphs and complete your scientific report to help protect this geothermal wonderland.",
      objectiveDescription: "Apply advanced maths including graphing, percentages, and data analysis.",
      requiredQuestions: 7,
      subject: "maths",
      difficulty: "hard",
      rewardPoints: 80,
    },
  ],
};

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

  console.log("\nSeeding database with initial stories...");

  for (const storyData of initialStories) {
    // Check if story already exists
    const existing = await db
      .select()
      .from(stories)
      .where(eq(stories.title, storyData.title));

    if (existing.length === 0) {
      const [story] = await db.insert(stories).values(storyData).returning();
      console.log(`✓ Added story: ${storyData.title}`);

      // Add chapters for this story
      const chapterData = storyChapters[storyData.title as keyof typeof storyChapters];
      if (chapterData) {
        for (const chapter of chapterData) {
          await db.insert(chapters).values({
            ...chapter,
            storyId: story.id,
          });
          console.log(`  ✓ Added chapter ${chapter.chapterNumber}: ${chapter.title}`);
        }
      }
    } else {
      console.log(`- Story already exists: ${storyData.title}`);
    }
  }

  console.log("\nDatabase seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
