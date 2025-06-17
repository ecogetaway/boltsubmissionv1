import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

const Dashboard = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition');
    }
  }, [browserSupportsSpeechRecognition]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = async () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      await processMessage(transcript);
      resetTranscript();
    }
  };

  const processMessage = async (message) => {
    setIsProcessing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/check-in', {
        message,
      });

      const newMessages = [
        ...messages,
        { type: 'user', content: message },
        {
          type: 'bot',
          content: response.data.response,
          audio: response.data.audio,
        },
      ];

      setMessages(newMessages);

      // Play audio response
      if (response.data.audio) {
        const audio = new Audio(`data:audio/mpeg;base64,${response.data.audio}`);
        audio.play();
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages([
        ...messages,
        { type: 'user', content: message },
        {
          type: 'bot',
          content: 'I apologize, but I encountered an error. Please try again.',
        },
      ]);
    }
    setIsProcessing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chat Interface */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '70vh',
            }}
          >
            <Typography variant="h4" gutterBottom>
              How are you feeling today?
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                mb: 2,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
              }}
            >
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      message.type === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor:
                        message.type === 'user' ? '#1976d2' : '#ffffff',
                      color: message.type === 'user' ? '#ffffff' : 'inherit',
                    }}
                  >
                    <Typography>{message.content}</Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                sx={{ flex: 1 }}
              >
                {isListening ? 'Stop Speaking' : 'Start Speaking'}
              </Button>
              {isProcessing && <CircularProgress size={24} />}
            </Box>
            {transcript && (
              <Typography sx={{ mt: 2, p: 2, backgroundColor: '#e3f2fd' }}>
                {transcript}
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Exercises Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              Mental Health Exercises
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ mb: 2 }}
            >
              Guided Breathing
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ mb: 2 }}
            >
              Positive Affirmations
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              sx={{ mb: 2 }}
            >
              Self-Hypnosis
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 