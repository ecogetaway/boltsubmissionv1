from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from textblob import TextBlob
from elevenlabs import generate, set_api_key
import bcrypt
from supabase import create_client, Client

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
jwt = JWTManager(app)

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

# Set ElevenLabs API key
set_api_key(os.getenv('ELEVENLABS_API_KEY'))

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user exists
    user = supabase.table('users').select('*').eq('username', data['username']).execute()
    if user.data:
        return jsonify({'error': 'Username already exists'}), 400
    
    # Hash password
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    new_user = {
        'username': data['username'],
        'password_hash': password_hash.decode('utf-8'),
        'created_at': datetime.utcnow().isoformat()
    }
    
    result = supabase.table('users').insert(new_user).execute()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Get user
    user = supabase.table('users').select('*').eq('username', data['username']).execute()
    
    if not user.data or not bcrypt.checkpw(
        data['password'].encode('utf-8'),
        user.data[0]['password_hash'].encode('utf-8')
    ):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.data[0]['id'])
    return jsonify({'access_token': access_token}), 200

@app.route('/api/check-in', methods=['POST'])
@jwt_required()
def emotional_check_in():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Analyze sentiment
    blob = TextBlob(data['message'])
    mood_score = blob.sentiment.polarity
    
    # Create session record
    session = {
        'user_id': user_id,
        'mood_score': mood_score,
        'transcript': data['message'],
        'timestamp': datetime.utcnow().isoformat()
    }
    
    supabase.table('sessions').insert(session).execute()
    
    # Generate voice response
    response_text = generate_response(mood_score)
    audio = generate(
        text=response_text,
        voice="Rachel",
        model="eleven_monolingual_v1"
    )
    
    return jsonify({
        'mood_score': mood_score,
        'response': response_text,
        'audio': audio
    })

@app.route('/api/exercises', methods=['GET'])
@jwt_required()
def get_exercises():
    exercises = {
        'breathing': {
            'title': 'Guided Breathing',
            'duration': '5 minutes',
            'description': 'A calming breathing exercise to reduce stress'
        },
        'affirmations': {
            'title': 'Positive Affirmations',
            'duration': '3 minutes',
            'description': 'Uplifting statements to boost mood'
        },
        'hypnosis': {
            'title': 'Self-Hypnosis',
            'duration': '10 minutes',
            'description': 'Deep relaxation and positive suggestion'
        }
    }
    return jsonify(exercises)

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    sessions = supabase.table('sessions')\
        .select('*')\
        .eq('user_id', user_id)\
        .order('timestamp', desc=True)\
        .execute()
    
    return jsonify([{
        'timestamp': session['timestamp'],
        'mood_score': session['mood_score'],
        'exercise_type': session.get('exercise_type')
    } for session in sessions.data])

def generate_response(mood_score):
    if mood_score > 0.5:
        return "I'm glad to hear you're feeling positive! Would you like to try a breathing exercise to maintain this good mood?"
    elif mood_score > 0:
        return "I'm happy you're doing okay. Would you like to try some positive affirmations to boost your mood further?"
    elif mood_score > -0.5:
        return "I understand you might be feeling a bit down. Would you like to try a guided breathing exercise to help you feel better?"
    else:
        return "I'm here to support you. Would you like to try a calming self-hypnosis session to help you feel more at peace?"

if __name__ == '__main__':
    app.run(debug=True) 