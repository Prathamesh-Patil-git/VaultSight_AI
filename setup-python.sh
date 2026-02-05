#!/bin/bash

echo "Starting VaultSight AI Python Embedding Service Setup..."

cd python-embedding

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies (this may take a while)..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Setup complete!"
echo "To run the service: source venv/bin/activate && python main.py"
