"""
Standardized HTTP response utilities for Lambda functions
"""
import json

def success_response(data, status_code=200):
    """Return a successful JSON response"""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true"
        },
        "body": json.dumps(data)
    }

def error_response(message, status_code=400):
    """Return an error JSON response"""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"message": message})
    }

def unauthorized_response(message="Unauthorized"):
    """Return a 401 Unauthorized response"""
    return error_response(message, 401)

def not_found_response(message="Not found"):
    """Return a 404 Not Found response"""
    return error_response(message, 404)

def server_error_response(message="Internal server error"):
    """Return a 500 Internal Server Error response"""
    return error_response(message, 500)
