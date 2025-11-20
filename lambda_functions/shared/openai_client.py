"""
OpenAI client utilities for Lambda functions
Handles question generation and answer validation
"""
import os
import json
from openai import OpenAI

client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

def generate_question(subject, year_level, topic=None):
    """
    Generate a curriculum-aligned question using OpenAI GPT-5
    
    Args:
        subject: 'maths' or 'english'
        year_level: 1-8 (NZ curriculum year levels)
        topic: Optional specific topic
        
    Returns:
        dict: Question data with question, answer, type, options, etc.
    """
    system_prompt = f"""You are a New Zealand primary school teacher creating engaging practice questions 
    for Year {year_level} students. Generate questions aligned with the NZ curriculum.
    
    Return JSON with this structure:
    {{
        "question": "The question text",
        "correctAnswer": "The correct answer",
        "type": "text" | "multiple_choice" | "fill_blank" | "word_problem",
        "options": ["option1", "option2", "option3", "option4"],  // for multiple_choice only
        "topic": "The specific topic covered",
        "hint": "A helpful hint",
        "explanation": "Why this is the correct answer"
    }}
    """
    
    user_prompt = f"Generate a Year {year_level} {subject} question"
    if topic:
        user_prompt += f" about {topic}"
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    question_data = json.loads(response.choices[0].message.content)
    
    # Add unique ID
    import uuid
    question_data['id'] = str(uuid.uuid4())
    question_data['difficulty'] = 'medium'
    
    return question_data

def validate_answer(question, correct_answer, user_answer, subject):
    """
    Validate user's answer and provide feedback
    
    Args:
        question: The question text
        correct_answer: The correct answer
        user_answer: User's submitted answer
        subject: 'maths' or 'english'
        
    Returns:
        dict: Validation result with isCorrect and feedback
    """
    system_prompt = f"""You are a supportive NZ primary school teacher providing feedback on student answers.
    Be encouraging and constructive.
    
    Return JSON with this structure:
    {{
        "isCorrect": true | false,
        "feedback": "Encouraging feedback message",
        "explanation": "Brief explanation of the answer"
    }}
    """
    
    user_prompt = f"""Question: {question}
Correct Answer: {correct_answer}
Student Answer: {user_answer}

Evaluate if the student's answer is correct (consider minor spelling/formatting variations for correct answers).
Provide encouraging feedback."""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)
