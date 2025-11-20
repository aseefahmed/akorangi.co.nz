"""
Lambda function: Create/adopt a pet
Equivalent to: POST /api/pets
"""
import json
from shared import require_auth, execute_insert, execute_one, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Create a new pet for the user
    
    Request body:
        {
            "name": "Pet name",
            "type": "cat" | "dog" | "dragon" | "robot" | "owl" | "fox"
        }
        
    Returns:
        Created pet
    """
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        name = body.get('name')
        pet_type = body.get('type')
        
        # Validation
        valid_types = ['cat', 'dog', 'dragon', 'robot', 'owl', 'fox']
        if not pet_type or pet_type not in valid_types:
            return error_response(f"Invalid pet type. Must be one of: {', '.join(valid_types)}")
        
        if not name or len(name.strip()) == 0:
            return error_response("Pet name is required")
        
        user_id = user['sub']
        
        # Check if user already has a pet
        existing_query = "SELECT id FROM pets WHERE \"userId\" = %s"
        existing_pet = execute_one(existing_query, (user_id,))
        
        if existing_pet:
            return error_response("User already has a pet", 400)
        
        # Create pet
        insert_query = """
            INSERT INTO pets
            ("userId", name, type, level, experience, happiness, hunger)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        pet = execute_insert(insert_query, (
            user_id,
            name.strip(),
            pet_type,
            1,      # level
            0,      # experience
            100,    # happiness
            50      # hunger
        ))
        
        return success_response(dict(pet), 201)
        
    except json.JSONDecodeError:
        return error_response("Invalid JSON in request body")
    except Exception as e:
        return error_response(str(e), 500)
