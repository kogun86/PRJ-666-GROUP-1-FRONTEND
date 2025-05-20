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
      // TODO: Replace with actual API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      const aiResponse = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Sorry, there was an error processing your request.',
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
