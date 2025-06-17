# SeniorCare Chatbot

A voice-enabled, mood-detecting mental health chatbot tailored for seniors. This web application provides daily emotional check-ins, mental health exercises, and personalized support through natural voice interactions.

## Features

- Voice-enabled interactions using ElevenLabs
- Mood detection and sentiment analysis
- Daily emotional check-ins
- Mental health exercises:
  - Guided breathing
  - Positive affirmations
  - Self-hypnosis sessions
- Session history tracking
- HIPAA-compliant data handling
- Senior-friendly UI with:
  - Large text
  - High contrast
  - Voice navigation
  - Responsive design for tablets and smartphones

## Tech Stack

- Backend: Python/Flask
- Frontend: React
- Voice: ElevenLabs API
- Sentiment Analysis: TextBlob
- Database: PostgreSQL
- Authentication: JWT

## Setup Instructions

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   - Create `.env` files in both backend and frontend directories
   - Add necessary API keys and configuration

5. Run the development servers:
   - Backend: `python app.py`
   - Frontend: `npm start`

## Security & Compliance

- HIPAA-compliant data handling
- Encrypted data storage
- Secure authentication
- Regular security audits

## Accessibility

- WCAG 2.1 compliant
- Screen reader support
- Keyboard navigation
- High contrast mode
- Adjustable text size

## License

MIT License 

## Environment Variables

SECRET_KEY=development_secret_key_123
JWT_SECRET_KEY=development_jwt_secret_key_123
SUPABASE_URL=https://wvhvmhhuyupgorzdzyyk.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aHZtaGh1eXVwZ29yemR6eXlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTc0Mjc5MiwiZXhwIjoyMDY1MzE4NzkyfQ.NCkTBm92P9UOQkCTSf3MVoZD9lV3PoOhOmqHc1xFDnw
ELEVENLABS_API_KEY=sk_4091a0a076f7f1d68e76d1f0962f373036bc7cfa5be4e593
FLASK_ENV=development
FLASK_APP=app.py

REACT_APP_API_URL=http://localhost:5000
REACT_APP_SUPABASE_URL=https://wvhvmhhuyupgorzdzyyk.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2aHZtaGh1eXVwZ29yemR6eXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDI3OTIsImV4cCI6MjA2NTMxODc5Mn0.TeUaK7fyiDJoYNoXEVYTjb_GH_iBgf0pwnyfngLRDZw
REACT_APP_ELEVENLABS_API_KEY=sk_4091a0a076f7f1d68e76d1f0962f373036bc7cfa5be4e593 