#!/bin/bash

echo "Setting up Python environment for Accessibility Reporting App..."

# Create a Python virtual environment
python3 -m venv env

# Activate virtual environment
source env/bin/activate

# Upgrade pip and setuptools
pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "Installation complete! Virtual environment is ready."
    echo "To activate your environment, run: source env/bin/activate"
else
    echo "Installation failed. Please check the errors above."
fi

