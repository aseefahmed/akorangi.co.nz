"""
Lambda function: Get all practice sessions
Equivalent to: GET /api/practice-sessions/all
"""
from shared import require_auth, execute_query, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Get all user's practice sessions
    
    Returns:
        List of all practice sessions
    """
    try:
        user_id = user['sub']
        
        query = """
            SELECT id, subject, "yearLevel", "questionsAttempted", "questionsCorrect",
                   "pointsEarned", "startedAt", "completedAt"
            FROM "practiceSessions"
            WHERE "userId" = %s
            ORDER BY "startedAt" DESC
        """
        
        sessions = execute_query(query, (user_id,))
        
        return success_response([dict(s) for s in sessions])
        
    except Exception as e:
        return error_response(str(e), 500)
