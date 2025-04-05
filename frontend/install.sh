#!/bin/bash

echo "Installing Node.js dependencies for the frontend..."

# Ensure npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Install dependencies
npm install react react-dom react-bootstrap bootstrap axios

if [ $? -eq 0 ]; then
    echo "Frontend dependencies installed successfully!"
else
    echo "Failed to install frontend dependencies. Please check the errors above."
    exit 1
fi
