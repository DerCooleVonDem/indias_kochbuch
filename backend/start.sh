#!/bin/bash

# Enable error handling
set -e

echo "Starting application initialization process..."

# Run the database initialization script
echo "Running database initialization script..."
/app/init-db.sh

# Check if initialization was successful
if [ $? -ne 0 ]; then
  echo "ERROR: Database initialization failed! Exiting..."
  exit 1
fi

echo "Database initialization completed successfully."
echo "Starting Node.js application..."

# Start the Node.js application
npm start