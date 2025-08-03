#!/bin/sh

# Enable verbose output for debugging
set -x

# Wait for the PostgreSQL server to become available
echo "Waiting for PostgreSQL to start..."
until pg_isready -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL started, initializing database..."

# Verify environment variables
echo "Using database connection parameters:"
echo "POSTGRES_HOST: $POSTGRES_HOST"
echo "POSTGRES_USER: $POSTGRES_USER"
echo "POSTGRES_DB: $POSTGRES_DB"

# Verify the schema.sql file exists
if [ ! -f /app/db/schema.sql ]; then
  echo "ERROR: Schema file /app/db/schema.sql not found!"
  exit 1
fi

echo "Schema file found, executing SQL commands..."

# Run the schema.sql file to create tables and initial data with retry mechanism
MAX_RETRIES=5
RETRY_COUNT=0
SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$SUCCESS" = false ]; do
  if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f /app/db/schema.sql; then
    echo "Schema successfully applied!"
    SUCCESS=true
  else
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Failed to apply schema (attempt $RETRY_COUNT/$MAX_RETRIES). Retrying in 5 seconds..."
    sleep 5
  fi
done

if [ "$SUCCESS" = true ]; then
  echo "Database initialization completed successfully!"
  
  # Verify the recipes table was created
  echo "Verifying recipes table exists..."
  if PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT COUNT(*) FROM recipes;"; then
    echo "Recipes table verified successfully!"
  else
    echo "WARNING: Could not verify recipes table!"
  fi
else
  echo "ERROR: Failed to initialize database after $MAX_RETRIES attempts!"
  exit 1
fi