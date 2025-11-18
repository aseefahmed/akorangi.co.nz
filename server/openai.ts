import OpenAI from "openai";

// Using OpenAI's API with your API key
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateQuestion(
  subject: "maths" | "english",
  yearLevel: number,
  topic?: string,
  difficulty?: "easy" | "medium" | "hard"
): Promise<{
  question: string;
  correctAnswer: string;
  topic: string;
  difficulty: string;
}> {
  const difficultyModifier = difficulty 
    ? `\nDifficulty Level: ${difficulty} - ${getDifficultyGuidance(difficulty)}`
    : "";

  const prompt = `Generate a single ${subject} practice question for a New Zealand Year ${yearLevel} student.
${topic ? `Topic: ${topic}` : ""}${difficultyModifier}

Requirements:
- Aligned with New Zealand curriculum for Year ${yearLevel}
- Age-appropriate and engaging for children
- Clear and concise question
- Definitive correct answer

Return a JSON object with:
{
  "question": "the practice question",
  "correctAnswer": "the correct answer",
  "topic": "specific topic (e.g., 'addition', 'reading comprehension')",
  "difficulty": "${difficulty || 'medium'}"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are an expert New Zealand primary school teacher creating engaging practice questions. Respond with JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result;
}

function getDifficultyGuidance(difficulty: "easy" | "medium" | "hard"): string {
  switch (difficulty) {
    case "easy":
      return "Make this question easier than typical for this year level. Use simple vocabulary and straightforward concepts.";
    case "hard":
      return "Make this question more challenging than typical for this year level. Include multi-step thinking or advanced concepts.";
    default:
      return "Make this question at a typical difficulty level for this year.";
  }
}

export async function validateAnswer(
  question: string,
  correctAnswer: string,
  userAnswer: string,
  subject: "maths" | "english"
): Promise<{
  isCorrect: boolean;
  feedback: string;
}> {
  const prompt = `A New Zealand Year student answered a ${subject} question.

Question: ${question}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}

Provide:
1. Whether the answer is correct (be lenient with minor spelling/formatting differences)
2. Encouraging, child-friendly feedback (1-2 sentences)
   - If correct: Praise and explain why it's right
   - If incorrect: Be encouraging, explain the concept gently

Return JSON:
{
  "isCorrect": true/false,
  "feedback": "encouraging message"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are a supportive New Zealand primary school teacher providing feedback to students. Be encouraging and positive. Respond with JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  return result;
}
