"""
Auth0 JWT validation utilities for Lambda functions
Validates JWT tokens from Auth0 without requiring Express sessions
"""
import os
import json
from jose import jwt, JWTError
from six.moves.urllib.request import urlopen

# Auth0 configuration
AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.environ.get('AUTH0_CLIENT_ID')
ALGORITHMS = ["RS256"]

def get_auth0_public_key():
    """
    Fetch Auth0 public key for JWT verification
    Cached for performance
    """
    jsonurl = urlopen(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
    jwks = json.loads(jsonurl.read())
    return jwks

def validate_token(token):
    """
    Validate Auth0 JWT token and return user info
    
    Args:
        token: JWT token from Authorization header
        
    Returns:
        dict: User information from token payload
        
    Raises:
        JWTError: If token is invalid
    """
    try:
        # Get Auth0 public key
        jwks = get_auth0_public_key()
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        
        # Find the correct signing key
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
                break
        
        if not rsa_key:
            raise JWTError("Unable to find appropriate key")
        
        # Verify token
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=ALGORITHMS,
            audience=AUTH0_CLIENT_ID,
            issuer=f"https://{AUTH0_DOMAIN}/"
        )
        
        return payload
        
    except JWTError as e:
        raise Exception(f"Invalid token: {str(e)}")

def get_user_from_event(event):
    """
    Extract and validate user from API Gateway event
    
    Args:
        event: AWS Lambda event from API Gateway
        
    Returns:
        dict: User information
        
    Raises:
        Exception: If authorization fails
    """
    # Get Authorization header
    headers = event.get('headers', {})
    auth_header = headers.get('Authorization') or headers.get('authorization')
    
    if not auth_header:
        raise Exception("Missing Authorization header")
    
    # Extract token
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise Exception("Invalid Authorization header format")
    
    token = parts[1]
    
    # Validate and return user info
    return validate_token(token)

def require_auth(handler):
    """
    Decorator to require authentication for Lambda handlers
    
    Usage:
        @require_auth
        def lambda_handler(event, context, user):
            # user is automatically injected
            return {"statusCode": 200, "body": json.dumps({"userId": user['sub']})}
    """
    def wrapper(event, context):
        try:
            user = get_user_from_event(event)
            return handler(event, context, user)
        except Exception as e:
            return {
                "statusCode": 401,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"message": str(e)})
            }
    return wrapper
