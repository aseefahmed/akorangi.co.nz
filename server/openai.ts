import OpenAI from "openai";

// Using OpenAI's API with your API key
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type QuestionType = "text" | "multiple_choice" | "fill_blank" | "word_problem" | "story";

export async function generateQuestion(
  subject: "maths" | "english",
  yearLevel: number,
  topic?: string,
  difficulty?: "easy" | "medium" | "hard",
  questionType?: QuestionType
): Promise<{
  question: string;
  correctAnswer: string;
  topic: string;
  difficulty: string;
  type?: QuestionType;
  options?: string[];
  hint?: string;
  explanation?: string;
}> {
  const difficultyModifier = difficulty 
    ? `\nDifficulty Level: ${difficulty} - ${getDifficultyGuidance(difficulty)}`
    : "";

  const typeGuidance = getQuestionTypeGuidance(questionType || "text", subject);

  const prompt = `Generate a single ${subject} practice question for a New Zealand Year ${yearLevel} student.
${topic ? `Topic: ${topic}` : ""}${difficultyModifier}
${typeGuidance}

Requirements:
- Aligned with New Zealand curriculum for Year ${yearLevel}
- Age-appropriate and engaging for children
- Clear and concise question
- Definitive correct answer
- Include a helpful hint that guides without giving away the answer
- Include a brief explanation for the correct answer

${questionType === "multiple_choice" ? `Return a JSON object with:
{
  "question": "the practice question",
  "correctAnswer": "the correct answer (must match one of the options exactly)",
  "options": ["option1", "option2", "option3", "option4"],
  "hint": "a helpful hint",
  "explanation": "brief explanation of the correct answer",
  "topic": "specific topic",
  "difficulty": "${difficulty || 'medium'}",
  "type": "multiple_choice"
}` : `Return a JSON object with:
{
  "question": "the practice question",
  "correctAnswer": "the correct answer",
  "hint": "a helpful hint",
  "explanation": "brief explanation of the correct answer",
  "topic": "specific topic",
  "difficulty": "${difficulty || 'medium'}",
  "type": "${questionType || 'text'}"
}`}`;

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "You are an expert New Zealand primary school teacher creating fun, engaging practice questions for children. Make questions interesting and age-appropriate. Respond with JSON only.",
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

function getQuestionTypeGuidance(type: QuestionType, subject: string): string {
  switch (type) {
    case "multiple_choice":
      return `Question Type: Multiple Choice
- Provide 4 options (A, B, C, D)
- Make all options plausible to test understanding
- Only one option should be correct
- Mix up the position of the correct answer`;
    
    case "fill_blank":
      return `Question Type: Fill in the Blank
- Create a sentence or problem with one key word/number missing
- Use _____ to indicate where the answer goes
- The answer should be a single word or number`;
    
    case "word_problem":
      return `Question Type: Word Problem (${subject})
- Create a real-world scenario that requires applying knowledge
- Make it relatable to New Zealand children (e.g., kiwi birds, rugby, beach trips)
- Include all necessary information to solve
- Make it engaging with a story element`;
    
    case "story":
      return `Question Type: Story-Based Learning
- Create a short, engaging story (2-3 sentences)
- Embed the learning concept within the narrative
- Make it fun and imaginative for children
- The question should test comprehension or application of the concept in the story`;
    
    default:
      return `Question Type: Direct Question
- Clear, straightforward question
- Requires a specific answer`;
  }
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
