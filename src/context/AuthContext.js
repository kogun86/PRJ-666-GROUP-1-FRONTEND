import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth, isProduction as checkIsProduction } from '../lib/auth';

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

        // In production, check for authenticated user with Amplify
        if (envData.isProduction) {
          try {
            // Get current authenticated user
            const currentUser = await Auth.currentAuthenticatedUser();
            if (currentUser) {
              // Get user attributes
              const userAttributes = await Auth.userAttributes(currentUser);

              // For Amplify v6, userAttributes is now an object not an array
              const userData = {
                name: userAttributes.name || currentUser.username || 'User',
                email: userAttributes.email || currentUser.username,
                // Add other attributes as needed
                lastLogin: new Date().toISOString(),
              };

              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));

              // If we're on the login page and user is authenticated, redirect to profile
              if (window.location.pathname === '/login') {
                router.replace('/profile');
              }
            }
          } catch (error) {
            // No authenticated user
            console.log('No authenticated user found:', error);
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          // In development, check for simple auth flag
          const isAuthenticated = localStorage.getItem('isAuthenticated');
          if (isAuthenticated === 'true') {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));

              // If we're on the login page and user is authenticated, redirect to profile
              if (window.location.pathname === '/login') {
                router.replace('/profile');
              }
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
  }, [router]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);

    try {
      if (isProduction) {
        try {
          // First try to sign out any existing session
          await Auth.signOut();
        } catch (signOutError) {
          // Ignore sign out errors
          console.log('No user to sign out or sign out failed', signOutError);
        }

        // Use Amplify Auth in production
        const user = await Auth.signIn(email, password);

        if (!user) {
          throw new Error('Authentication failed');
        }

        // Get user attributes - in v6 this directly returns an object
        const userAttributes = await Auth.userAttributes();

        // Create user object from attributes
        const userData = {
          name: userAttributes.name || email.split('@')[0] || 'User',
          email: userAttributes.email || email,
          // Add other attributes as needed
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
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
  const logout = async () => {
    try {
      if (isProduction) {
        // Use Amplify Auth in production
        await Auth.signOut();
      }

      // Clear local storage and state in both environments
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
