#!/bin/bash

# Navigate to the UI directory
cd ui

# Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the development server
echo "Starting Challo UI..."
npm run dev
