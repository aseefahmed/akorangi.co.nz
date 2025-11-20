"""
Lambda function: Get user's pet
Equivalent to: GET /api/pets
"""
from shared import require_auth, execute_one, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Get authenticated user's virtual pet
    
    Returns:
        Pet information or null if no pet
    """
    try:
        user_id = user['sub']
        
        # Query user's pet
        query = """
            SELECT id, "userId", name, type, level, experience,
                   happiness, hunger, "createdAt"
            FROM pets
            WHERE "userId" = %s
        """
        
        pet = execute_one(query, (user_id,))
        
        if not pet:
            return success_response(None)
        
        return success_response(dict(pet))
        
    except Exception as e:
        return error_response(str(e), 500)
