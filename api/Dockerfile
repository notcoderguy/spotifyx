# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.10.12
FROM python:${PYTHON_VERSION}-slim as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app

# Create and activate virtual environment
RUN python -m venv $VIRTUAL_ENV

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy your application code to the container
COPY . .

EXPOSE 8000

# Custom script to start both cron.py and uvicorn
COPY start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]
