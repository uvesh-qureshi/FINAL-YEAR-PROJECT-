// frontend/src/components/VoiceControl.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
      };
      
      recognitionInstance.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        setTranscript(`You said: "${speechResult}"`);
        handleVoiceCommand(speechResult);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'no-speech') {
          toast.error('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable it in browser settings.');
        } else {
          toast.error('Voice recognition error. Please try again.');
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
      console.log('Speech Recognition not supported in this browser');
    }
  }, []);

  const handleVoiceCommand = (command) => {
    console.log('Processing command:', command);
    
    // Save to localStorage
    const timestamp = new Date().toLocaleString();
    const commandHistory = JSON.parse(localStorage.getItem('voiceHistory') || '[]');
    commandHistory.unshift({ command, timestamp, executed: true });
    
    // Keep only last 50 commands
    if (commandHistory.length > 50) {
      commandHistory.pop();
    }
    
    localStorage.setItem('voiceHistory', JSON.stringify(commandHistory));
    
    // Command matching with multiple variations
    if (
      command.includes('create emergency') ||
      command.includes('new emergency') ||
      command.includes('start emergency') ||
      command.includes('emergency form')
    ) {
      toast.success('✅ Opening emergency form...');
      setTimeout(() => {
        try {
          navigate('/');
        } catch (error) {
          window.location.href = '/';
        }
      }, 500);
    }
    else if (
      command.includes('show dashboard') ||
      command.includes('open dashboard') ||
      command.includes('go to dashboard') ||
      command.includes('dashboard')
    ) {
      toast.success('✅ Opening dashboard...');
      setTimeout(() => {
        try {
          navigate('/dashboard');
        } catch (error) {
          window.location.href = '/dashboard';
        }
      }, 500);
    }
    else if (
      command.includes('list ambulances') ||
      command.includes('show ambulances') ||
      command.includes('ambulance list')
    ) {
      toast.success('✅ Showing ambulances...');
      setTimeout(() => {
        try {
          navigate('/dashboard');
        } catch (error) {
          window.location.href = '/dashboard';
        }
      }, 500);
    }
    else if (
      command.includes('check status') ||
      command.includes('emergency status') ||
      command.includes('show status')
    ) {
      toast.success('✅ Checking status...');
      setTimeout(() => {
        try {
          navigate('/dashboard');
        } catch (error) {
          window.location.href = '/dashboard';
        }
      }, 500);
    }
    else if (
      command.includes('go home') ||
      command.includes('home page') ||
      command.includes('main page')
    ) {
      toast.success('✅ Going to home...');
      setTimeout(() => {
        try {
          navigate('/');
        } catch (error) {
          window.location.href = '/';
        }
      }, 500);
    }
    else if (
      command.includes('help me') ||
      command.includes('show help') ||
      command.includes('need help') ||
      command.includes('open help')
    ) {
      toast.success('✅ Opening voice help guide...');
      // Trigger help modal by clicking the button
      setTimeout(() => {
        const helpButton = document.querySelector('.voice-help-btn');
        if (helpButton) {
          helpButton.click();
        }
      }, 500);
    }
    else if (
      command.includes('help') ||
      command.includes('what can you do') ||
      command.includes('commands')
    ) {
      toast.info('📢 Available commands: Create emergency, Show dashboard, List ambulances, Check status, Go home. Say "help me" for detailed guide.');
    }
    else {
      toast.warning(`❓ Command not recognized: "${command}". Try "help" for available commands.`);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast.error('Could not start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return (
      <div className="voice-control-unsupported">
        <button className="voice-btn voice-btn-disabled" disabled title="Voice control not supported in this browser">
          🎙️ Voice Not Supported
        </button>
      </div>
    );
  }

  return (
    <div className="voice-control">
      <button
        className={`voice-btn ${isListening ? 'voice-btn-listening' : 'voice-btn-ready'}`}
        onClick={isListening ? stopListening : startListening}
        title={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? '🔴 Listening...' : '🎙️ Voice Command'}
      </button>
      
      {transcript && (
        <div className="voice-feedback">
          <p className="voice-transcript">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceControl;
