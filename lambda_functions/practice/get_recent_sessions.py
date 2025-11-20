"""
Lambda function: Get recent practice sessions
Equivalent to: GET /api/practice-sessions/recent
"""
from shared import require_auth, execute_query, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Get user's recent practice sessions (last 5 completed)
    
    Returns:
        List of recent practice sessions
    """
    try:
        user_id = user['sub']
        
        query = """
            SELECT id, subject, "yearLevel", "questionsAttempted", "questionsCorrect",
                   "pointsEarned", "startedAt", "completedAt"
            FROM "practiceSessions"
            WHERE "userId" = %s AND "completedAt" IS NOT NULL
            ORDER BY "completedAt" DESC
            LIMIT 5
        """
        
        sessions = execute_query(query, (user_id,))
        
        return success_response([dict(s) for s in sessions])
        
    except Exception as e:
        return error_response(str(e), 500)
