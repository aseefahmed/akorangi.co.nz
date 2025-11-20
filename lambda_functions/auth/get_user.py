"""
Lambda function: Get authenticated user profile
Equivalent to: GET /api/auth/user
"""
from shared import require_auth, execute_one, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Get authenticated user's profile information
    
    Returns:
        User profile with points, streak, achievements, etc.
    """
    try:
        # Extract user ID from Auth0 token
        user_id = user['sub']
        
        # Query user from database
        query = """
            SELECT id, email, "firstName", "lastName", role, "yearLevel",
                   "totalPoints", "currentStreak", "profileImageUrl",
                   "mathsDifficulty", "englishDifficulty",
                   "mathsRecentAccuracy", "englishRecentAccuracy",
                   "createdAt"
            FROM users
            WHERE id = %s
        """
        
        user_data = execute_one(query, (user_id,))
        
        if not user_data:
            return error_response("User not found", 404)
        
        return success_response(dict(user_data))
        
    except Exception as e:
        return error_response(str(e), 500)

# For local testing
if __name__ == "__main__":
    # Test with mock event
    test_event = {
        "headers": {
            "Authorization": "Bearer <your-test-token>"
        }
    }
    result = lambda_handler(test_event, None)
    print(result)
