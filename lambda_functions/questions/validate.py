"""
Lambda function: Validate answer using OpenAI
Equivalent to: POST /api/questions/validate
"""
import json
from shared import require_auth, execute_insert, execute_update, validate_answer, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Validate user's answer and provide feedback
    
    Request body:
        {
            "sessionId": "session-id",
            "questionId": "question-id",
            "question": "The question text",
            "correctAnswer": "The correct answer",
            "userAnswer": "User's submitted answer",
            "subject": "maths" | "english"
        }
        
    Returns:
        Validation result with feedback
    """
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        session_id = body.get('sessionId')
        question_id = body.get('questionId')
        question = body.get('question')
        correct_answer = body.get('correctAnswer')
        user_answer = body.get('userAnswer')
        subject = body.get('subject')
        
        # Validation
        if not all([session_id, question_id, question, correct_answer, user_answer, subject]):
            return error_response("Missing required fields")
        
        # Validate answer using OpenAI
        result = validate_answer(question, correct_answer, user_answer, subject)
        is_correct = result['isCorrect']
        
        # Record question attempt in database
        record_query = """
            INSERT INTO "sessionQuestions"
            ("sessionId", "questionId", question, "userAnswer", "isCorrect", feedback, "answeredAt")
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
        """
        execute_insert(record_query, (
            session_id,
            question_id,
            question,
            user_answer,
            is_correct,
            result['feedback']
        ))
        
        # Update session stats
        if is_correct:
            update_query = """
                UPDATE "practiceSessions"
                SET "questionsAttempted" = COALESCE("questionsAttempted", 0) + 1,
                    "questionsCorrect" = COALESCE("questionsCorrect", 0) + 1,
                    "pointsEarned" = COALESCE("pointsEarned", 0) + 10
                WHERE id = %s
            """
        else:
            update_query = """
                UPDATE "practiceSessions"
                SET "questionsAttempted" = COALESCE("questionsAttempted", 0) + 1
                WHERE id = %s
            """
        
        execute_update(update_query, (session_id,))
        
        return success_response(result)
        
    except json.JSONDecodeError:
        return error_response("Invalid JSON in request body")
    except Exception as e:
        return error_response(f"Failed to validate answer: {str(e)}", 500)
