"""
Lambda function: Create student-teacher/parent link
Equivalent to: POST /api/student-links
"""
import json
from shared import require_auth, execute_insert, execute_one, success_response, error_response

@require_auth
def lambda_handler(event, context, user):
    """
    Create a link request between supervisor (parent/teacher) and student
    
    Request body:
        {
            "studentEmail": "student@example.com"
        }
        
    Returns:
        Created student link (pending approval)
    """
    try:
        body = json.loads(event.get('body', '{}'))
        student_email = body.get('studentEmail')
        
        if not student_email:
            return error_response("Student email is required")
        
        supervisor_id = user['sub']
        
        # Verify supervisor is parent or teacher
        supervisor_query = "SELECT role FROM users WHERE id = %s"
        supervisor = execute_one(supervisor_query, (supervisor_id,))
        
        if not supervisor or supervisor['role'] not in ['parent', 'teacher']:
            return error_response("Only parents and teachers can link to students", 403)
        
        # Find student by email
        student_query = "SELECT id, role FROM users WHERE email = %s"
        student = execute_one(student_query, (student_email,))
        
        if not student:
            return error_response("Student not found", 404)
        
        if student['role'] != 'student':
            return error_response("User is not a student", 400)
        
        student_id = student['id']
        
        # Check if link already exists
        existing_query = """
            SELECT id FROM "studentLinks"
            WHERE "supervisorId" = %s AND "studentId" = %s
        """
        existing = execute_one(existing_query, (supervisor_id, student_id))
        
        if existing:
            return error_response("Link already exists", 400)
        
        # Create link (pending approval)
        insert_query = """
            INSERT INTO "studentLinks"
            ("supervisorId", "studentId", status)
            VALUES (%s, %s, %s)
        """
        
        link = execute_insert(insert_query, (supervisor_id, student_id, 'pending'))
        
        return success_response(dict(link), 201)
        
    except json.JSONDecodeError:
        return error_response("Invalid JSON in request body")
    except Exception as e:
        return error_response(str(e), 500)
