import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProduction, setIsProduction] = useState(false);
  const router = useRouter();

  // Check if the user is authenticated on mount and route changes
  useEffect(() => {
    async function loadUserFromLocalStorage() {
      try {
        // Check if we're in production or development
        const envCheck = await fetch('/api/check-environment');
        const envData = await envCheck.json();
        setIsProduction(envData.isProduction);

        // In production, check for JWT token
        if (envData.isProduction) {
          const token = localStorage.getItem('authToken');
          if (token) {
            // Verify token with backend
            const response = await fetch('/api/auth/verify-token', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
            } else {
              // Token invalid or expired
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } else {
          // In development, check for simple auth flag
          const isAuthenticated = localStorage.getItem('isAuthenticated');
          if (isAuthenticated === 'true') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            }
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserFromLocalStorage();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);

    try {
      if (isProduction) {
        // Use Cognito auth in production
        const response = await fetch('/api/auth/cognito-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        //setIsAuthenticated(true);
        return true;
      } else {
        // Use simple auth in development
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        // For demo, allow any non-empty values in dev
        const mockUser = {
          name: 'Development User',
          email: email,
          dateOfBirth: '1990-01-01',
          lastLogin: new Date().toISOString(),
        };
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      return { error: err.message || 'Failed to login' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        logout,
        isProduction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
