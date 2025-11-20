"""
Shared database utilities for Lambda functions
Uses psycopg2 for PostgreSQL connections with connection pooling
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager

# Database connection configuration
DATABASE_URL = os.environ.get('DATABASE_URL')

@contextmanager
def get_db_connection():
    """
    Context manager for database connections
    Automatically handles connection cleanup
    """
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def execute_query(query, params=None):
    """
    Execute a SELECT query and return results as list of dicts
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchall()

def execute_one(query, params=None):
    """
    Execute a SELECT query and return single result as dict
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchone()

def execute_insert(query, params=None):
    """
    Execute an INSERT query and return the inserted row
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query + " RETURNING *", params or ())
            result = cursor.fetchone()
            conn.commit()
            return result

def execute_update(query, params=None):
    """
    Execute an UPDATE query and return the updated row
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query + " RETURNING *", params or ())
            result = cursor.fetchone()
            conn.commit()
            return result
