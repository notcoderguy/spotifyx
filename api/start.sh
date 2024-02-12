#!/bin/bash

# Start the cron script in the background
python cron.py &

# Start the Uvicorn server
uvicorn main:app --host 0.0.0.0 --port 8000
