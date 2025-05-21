import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/AIChatWindow.module.css';

const AIChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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
      const response = await fetch('http://localhost:8080/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You may need to add authorization header here
          Authorization: 'Bearer mock-id-token',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

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
        <button className={styles.button} onClick={() => setIsOpen(true)}>
          <span className={styles.icon}>💬</span>
        </button>
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
                      <div className={styles.loadingDots}>
                        <span></span>
                        <span></span>
                        <span></span>
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
