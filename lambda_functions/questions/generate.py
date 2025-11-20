"""
Lambda function: Generate question using OpenAI
Equivalent to: POST /api/questions/generate
"""
import json
from shared import require_auth, generate_question, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Generate a curriculum-aligned question using AI
    
    Request body:
        {
            "subject": "maths" | "english",
            "yearLevel": 1-8,
            "topic": "optional topic"
        }
        
    Returns:
        Generated question with answer, options, hints, etc.
    """
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        subject = body.get('subject')
        year_level = body.get('yearLevel')
        topic = body.get('topic')
        
        # Validation
        if not subject or subject not in ['maths', 'english']:
            return error_response("Invalid subject")
        
        if not year_level or not (1 <= year_level <= 8):
            return error_response("Invalid year level")
        
        # Generate question using OpenAI
        question = generate_question(subject, year_level, topic)
        
        return success_response(question)
        
    except json.JSONDecodeError:
        return error_response("Invalid JSON in request body")
    except Exception as e:
        return error_response(f"Failed to generate question: {str(e)}", 500)

# For local testing
if __name__ == "__main__":
    test_event = {
        "headers": {"Authorization": "Bearer <token>"},
        "body": json.dumps({
            "subject": "maths",
            "yearLevel": 5,
            "topic": "multiplication"
        })
    }
    result = lambda_handler(test_event, None)
    print(json.loads(result['body']))
