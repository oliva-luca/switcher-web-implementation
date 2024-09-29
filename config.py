import os

TEST = 'test'
PROD = 'production'
DEV = 'development'
ENVIRONMENT = os.getenv('ENVIRONMENT', DEV)

DATABASE_FILENAME = f"database_{ENVIRONMENT}"