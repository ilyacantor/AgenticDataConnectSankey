#!/bin/bash
# Deployment startup script - installs dependencies and starts the server
pip install --no-cache-dir -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port ${PORT:-5000}
