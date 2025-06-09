import { useState, useEffect } from 'react';
import { useAuth, useAuthProtection } from '../features/auth';
import Layout from './Layout';
import IntroAnimation from './ui/IntroAnimation';

export default function ProtectedRoute({ children }) {
  // Use our authentication protection hook
  const { isLoading } = useAuthProtection();
  const { user } = useAuth();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if we should show the intro animation
    const shouldShowIntro = localStorage.getItem('showIntroAnimation') === 'true';
    if (shouldShowIntro) {
      setShowIntro(true);

      // Clear the flag after 1 second
      const timer = setTimeout(() => {
        localStorage.removeItem('showIntroAnimation');
        setShowIntro(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Show loading state while authentication is checked
  if (isLoading || !user) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading...</div>
        </div>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 70vh;
          }
          .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #333;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          .loading-text {
            font-size: 1.5rem;
            color: #333;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Layout>
    );
  }

  // If authenticated and intro animation should be shown, display it
  if (showIntro) {
    return <IntroAnimation />;
  }

  // If authenticated, render the children
  return children;
}
