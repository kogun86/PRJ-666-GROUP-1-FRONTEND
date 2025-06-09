import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/AIChatWindow.module.css';
import { useAuth } from '@/features/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import Lottie from 'lottie-react';
import chatAnimation from '../assets/animations/chat.json';

// Define API base URL based on environment
const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api/v1'
    : `${process.env.NEXT_PUBLIC_API_URL}/v1`;

const AIChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, isProduction } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user is authenticated in production
  const checkAuthentication = () => {
    const isProd = process.env.NODE_ENV === 'production' || isProduction;

    if (isProd && !user) {
      console.warn('User not authenticated in production');
      return false;
    }

    return true;
  };

  // Get authentication headers
  const getHeaders = async () => {
    const baseHeaders = {
      'Content-Type': 'application/json',
    };

    // Check if we're in production based on NODE_ENV or useAuth hook
    const isProd = process.env.NODE_ENV === 'production' || isProduction;

    if (isProd) {
      try {
        console.log('Getting production auth token');
        // Get the current session
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          console.error('No ID token available in production');
          throw new Error('No ID token available');
        }

        console.log('Production token obtained successfully');
        return {
          ...baseHeaders,
          Authorization: `Bearer ${idToken}`,
        };
      } catch (err) {
        console.error('Error getting ID token in production:', err);
        throw new Error('Failed to get access token');
      }
    } else {
      // Development headers with mock token
      console.log('Using development mock token');
      return {
        ...baseHeaders,
        Authorization: 'Bearer mock-id-token',
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check authentication in production
    if (!checkAuthentication()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Please log in to use the chat feature.',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      return;
    }

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get authentication headers
      let headers;
      try {
        headers = await getHeaders();
        console.log('Request headers:', JSON.stringify(headers));
      } catch (authError) {
        console.error('Authentication error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      console.log(`Sending request to: ${API_BASE_URL}/chat`);
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: inputMessage }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);

        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }

        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', JSON.stringify(data));

      if (data.status === 'ok' && data.data) {
        const aiResponse = {
          id: data.data.metadata.messageId || Date.now() + 1,
          text: data.data.message,
          sender: 'ai',
          timestamp: new Date(data.data.metadata.timestamp).toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `Sorry, there was an error: ${error.message}`,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={styles.container}>
      {!isOpen && (
        <div className={styles.animationButton} onClick={() => setIsOpen(true)}>
          <Lottie
            animationData={chatAnimation}
            loop={true}
            style={{
              transform: 'scaleX(-1)',
              width: 80,
              height: 80,
            }}
            rendererSettings={{
              preserveAspectRatio: 'xMidYMid slice',
              clearCanvas: true,
            }}
          />
        </div>
      )}

      {isOpen && (
        <div className={`${styles.window} ${isMinimized ? styles.windowMinimized : ''}`}>
          <div className={styles.header}>
            <h3>AI Assistant</h3>
            <div className={styles.controls}>
              <button className={styles.controlButton} onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? '⬆️' : '⬇️'}
              </button>
              <button className={styles.controlButton} onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className={styles.messages}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.sender === 'user' ? styles.userMessage : styles.aiMessage
                    }`}
                  >
                    <div className={styles.messageContent}>
                      <p>{message.text}</p>
                      <span className={styles.timestamp}>{message.timestamp}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className={`${styles.message} ${styles.aiMessage}`}>
                    <div className={styles.messageContent}>
                      <div className={styles.loadingAnimation}>
                        <Lottie
                          animationData={chatAnimation}
                          loop={true}
                          style={{
                            transform: 'scaleX(-1)',
                            width: 90,
                            height: 90,
                          }}
                          rendererSettings={{
                            preserveAspectRatio: 'xMidYMid slice',
                            clearCanvas: true,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={styles.input}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows="1"
                />
                <button
                  className={styles.sendButton}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChatWindow;
