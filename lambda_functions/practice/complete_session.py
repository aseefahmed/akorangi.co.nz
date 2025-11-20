"""
Lambda function: Complete practice session
Equivalent to: POST /api/practice-sessions/{sessionId}/complete
"""
import json
from datetime import datetime
from shared import require_auth, execute_update, execute_one, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Complete a practice session and update user stats
    
    Path parameters:
        sessionId: The session ID to complete
        
    Returns:
        Updated session and user stats
    """
    try:
        # Get session ID from path
        path_params = event.get('pathParameters', {})
        session_id = path_params.get('sessionId')
        
        if not session_id:
            return error_response("Missing sessionId")
        
        user_id = user['sub']
        
        # Get session details
        session_query = """
            SELECT * FROM "practiceSessions"
            WHERE id = %s AND "userId" = %s
        """
        session = execute_one(session_query, (session_id, user_id))
        
        if not session:
            return error_response("Session not found", 404)
        
        if session.get('completedAt'):
            return error_response("Session already completed", 400)
        
        # Mark session as complete
        update_query = """
            UPDATE "practiceSessions"
            SET "completedAt" = %s
            WHERE id = %s
        """
        execute_update(update_query, (datetime.utcnow(), session_id))
        
        # Update user stats (points, streak)
        points_earned = session.get('pointsEarned', 0)
        
        user_update_query = """
            UPDATE users
            SET "totalPoints" = "totalPoints" + %s,
                "lastPracticeDate" = %s
            WHERE id = %s
        """
        execute_update(user_update_query, (points_earned, datetime.utcnow(), user_id))
        
        # Update pet experience if user has a pet
        pet_update_query = """
            UPDATE pets
            SET experience = experience + %s
            WHERE "userId" = %s
        """
        execute_update(pet_update_query, (points_earned, user_id))
        
        return success_response({
            "message": "Session completed successfully",
            "pointsEarned": points_earned
        })
        
    except Exception as e:
        return error_response(str(e), 500)
