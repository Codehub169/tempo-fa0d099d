#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Navigate to the directory where the script is located (optional, assumes execution from project root)
# cd "$(dirname "$0")"

# Install Node.js dependencies
echo "Installing dependencies..."
npm install

# Initialize the SQLite database (create tables if they don't exist)
echo "Initializing database..."
node src/database.js

# Set the port for the application
export PORT=9000

# Start the Node.js application
echo "Starting Eye Clinic Dashboard application on port $PORT..."
npm start
