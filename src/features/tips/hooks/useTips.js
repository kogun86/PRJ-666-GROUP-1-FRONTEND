import { useState } from 'react';
import { Auth } from '../../../features/auth/lib/amplifyClient';

export function useTips() {
  const [tips, setTips] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePersonalizedTips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      let headers;
      // In development mode, use mock headers
      if (process.env.NODE_ENV === 'development') {
        headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-id-token',
        };
        console.log('🔐 Using development mock headers');
      } else {
        // Production mode - use real auth
        const user = await Auth.getCurrentUser();
        if (!user || !user.authorizationHeaders) {
          throw new Error('You must be logged in to generate tips.');
        }
        headers = user.authorizationHeaders();
      }

      // Fetch personalized tips
      const response = await fetch(`${API_BASE_URL}/v1/tips`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📥 Tips response:', data);
      setTips(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('❌ Error fetching tips:', error);
      setError(error.message);
      setIsLoading(false);
      throw error;
    }
  };

  return {
    tips,
    isLoading,
    error,
    generatePersonalizedTips,
  };
}
