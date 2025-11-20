"""
Lambda function: Feed user's pet
Equivalent to: POST /api/pets/feed
"""
import json
from shared import require_auth, execute_update, execute_one, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Feed user's pet (costs 10 points, increases happiness, decreases hunger)
    
    Returns:
        Updated pet
    """
    try:
        user_id = user['sub']
        
        # Check user has enough points
        user_query = "SELECT \"totalPoints\" FROM users WHERE id = %s"
        user_data = execute_one(user_query, (user_id,))
        
        if not user_data or user_data['totalPoints'] < 10:
            return error_response("Not enough points to feed pet", 400)
        
        # Get pet
        pet_query = "SELECT * FROM pets WHERE \"userId\" = %s"
        pet = execute_one(pet_query, (user_id,))
        
        if not pet:
            return error_response("No pet found", 404)
        
        # Update pet stats
        update_pet_query = """
            UPDATE pets
            SET happiness = LEAST(happiness + 10, 100),
                hunger = GREATEST(hunger - 20, 0)
            WHERE \"userId\" = %s
        """
        updated_pet = execute_update(update_pet_query, (user_id,))
        
        # Deduct points from user
        update_user_query = """
            UPDATE users
            SET \"totalPoints\" = \"totalPoints\" - 10
            WHERE id = %s
        """
        execute_update(update_user_query, (user_id,))
        
        return success_response(dict(updated_pet))
        
    except Exception as e:
        return error_response(str(e), 500)
