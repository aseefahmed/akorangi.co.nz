"""
Lambda function: Create practice session
Equivalent to: POST /api/practice-sessions
"""
import json
from datetime import datetime
from shared import require_auth, execute_insert, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Create a new practice session
    
    Request body:
        {
            "subject": "maths" | "english",
            "yearLevel": 1-8
        }
        
    Returns:
        Created session with id
    """
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        subject = body.get('subject')
        year_level = body.get('yearLevel')
        
        # Validation
        if not subject or subject not in ['maths', 'english']:
            return error_response("Invalid subject. Must be 'maths' or 'english'")
        
        if not year_level or not (1 <= year_level <= 8):
            return error_response("Invalid year level. Must be between 1 and 8")
        
        user_id = user['sub']
        
        # Insert practice session
        query = """
            INSERT INTO "practiceSessions" 
            ("userId", subject, "yearLevel", "startedAt")
            VALUES (%s, %s, %s, %s)
        """
        
        session = execute_insert(
            query,
            (user_id, subject, year_level, datetime.utcnow())
        )
        
        return success_response(dict(session), 201)
        
    except json.JSONDecodeError:
        return error_response("Invalid JSON in request body")
    except Exception as e:
        return error_response(str(e), 500)

# For local testing
if __name__ == "__main__":
    test_event = {
        "headers": {"Authorization": "Bearer <token>"},
        "body": json.dumps({
            "subject": "maths",
            "yearLevel": 5
        })
    }
    result = lambda_handler(test_event, None)
    print(result)
