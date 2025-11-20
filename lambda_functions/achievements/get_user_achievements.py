"""
Lambda function: Get user's achievements
Equivalent to: GET /api/achievements/user
"""
from shared import require_auth, execute_query, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Get all achievements unlocked by the authenticated user
    
    Returns:
        List of user achievements with details
    """
    try:
        user_id = user['sub']
        
        # Query user achievements with achievement details
        query = """
            SELECT ua.*, a.name, a.description, a.icon, a.category, a.requirement
            FROM "userAchievements" ua
            JOIN achievements a ON ua."achievementId" = a.id
            WHERE ua."userId" = %s
            ORDER BY ua."unlockedAt" DESC
        """
        
        achievements = execute_query(query, (user_id,))
        
        return success_response([dict(a) for a in achievements])
        
    except Exception as e:
        return error_response(str(e), 500)
