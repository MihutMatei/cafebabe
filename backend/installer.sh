#!/bin/bash

echo "Setting up Python environment for backend..."

# Create a virtual environment
python3 -m venv env

# Activate the virtual environment
source env/bin/activate

# Upgrade pip, setuptools, and wheel
pip install --upgrade pip setuptools wheel

# Install backend dependencies
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "Backend environment setup complete! To activate, run: source env/bin/activate"
else
    echo "Installation failed. Please check the errors above."
fi

