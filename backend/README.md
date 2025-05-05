# Resume Optimizer Backend

A FastAPI-based backend service for resume optimization and analysis.

## Features

- Resume analysis and optimization
- Rate limiting
- JSON API responses
- CORS support
- Health check endpoint

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /analyze
Analyze and optimize a resume

Request body:
```json
{
    "content": "Your resume content here",
    "job_title": "Software Engineer",
    "industry": "Technology"
}
```

Response:
```json
{
    "score": 85.0,
    "suggestions": [
        "Add more action verbs",
        "Include quantifiable achievements"
    ],
    "keywords": ["Python", "FastAPI"],
    "improvements": {
        "formatting": 90.0,
        "content": 85.0
    },
    "ats_score": 82.0,
    "readability_score": 87.0
}
```

### GET /health
Health check endpoint

Response:
```json
{
    "status": "healthy"
}
```

## Rate Limiting

The API implements rate limiting:
- 5 requests per minute per IP address
- 429 status code when limit is exceeded

## Development

To run tests:
```bash
pytest
```

To format code:
```bash
black .
``` 