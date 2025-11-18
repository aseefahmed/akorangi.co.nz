import type { User } from "@shared/schema";

export type Difficulty = "easy" | "medium" | "hard";
export type Subject = "maths" | "english";

export function calculateAdaptiveDifficulty(
  user: User,
  subject: Subject,
  recentSessions: Array<{
    questionsAttempted: number | null;
    questionsCorrect: number | null;
  }>
): Difficulty {
  const currentDifficulty = subject === "maths" 
    ? user.mathsDifficulty 
    : user.englishDifficulty;
  
  const currentAccuracy = subject === "maths"
    ? user.mathsAccuracyRecent || 50
    : user.englishAccuracyRecent || 50;

  if (recentSessions.length < 3) {
    return (currentDifficulty as Difficulty) || "medium";
  }

  const recentAccuracy = calculateRecentAccuracy(recentSessions);

  if (recentAccuracy >= 85 && currentDifficulty !== "hard") {
    return increaseDifficulty(currentDifficulty as Difficulty);
  } else if (recentAccuracy <= 40 && currentDifficulty !== "easy") {
    return decreaseDifficulty(currentDifficulty as Difficulty);
  }

  return (currentDifficulty as Difficulty) || "medium";
}

function calculateRecentAccuracy(
  sessions: Array<{
    questionsAttempted: number | null;
    questionsCorrect: number | null;
  }>
): number {
  const last5 = sessions.slice(0, 5);
  
  const totalAttempted = last5.reduce(
    (sum, s) => sum + (s.questionsAttempted || 0),
    0
  );
  const totalCorrect = last5.reduce(
    (sum, s) => sum + (s.questionsCorrect || 0),
    0
  );

  if (totalAttempted === 0) return 50;
  
  return Math.round((totalCorrect / totalAttempted) * 100);
}

function increaseDifficulty(current: Difficulty): Difficulty {
  if (current === "easy") return "medium";
  if (current === "medium") return "hard";
  return "hard";
}

function decreaseDifficulty(current: Difficulty): Difficulty {
  if (current === "hard") return "medium";
  if (current === "medium") return "easy";
  return "easy";
}

export async function updateUserDifficulty(
  userId: string,
  subject: Subject,
  newDifficulty: Difficulty,
  newAccuracy: number,
  storage: any
): Promise<void> {
  const updates = subject === "maths"
    ? {
        mathsDifficulty: newDifficulty,
        mathsAccuracyRecent: newAccuracy,
      }
    : {
        englishDifficulty: newDifficulty,
        englishAccuracyRecent: newAccuracy,
      };

  await storage.updateUser(userId, updates);
}

export function getDifficultyPromptModifier(difficulty: Difficulty): string {
  switch (difficulty) {
    case "easy":
      return "Make this question easier than typical for this year level. Use simple vocabulary and straightforward concepts.";
    case "hard":
      return "Make this question more challenging than typical for this year level. Include multi-step thinking or advanced concepts.";
    default:
      return "Make this question at a typical difficulty level for this year.";
  }
}
