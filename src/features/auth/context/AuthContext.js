import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth, isProduction as checkIsProduction } from '../lib';

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
        const envCheck = await fetch('/api/auth/check-environment');
        const envData = await envCheck.json();
        setIsProduction(envData.isProduction);

        // In production, check for authenticated user with Amplify
        if (envData.isProduction) {
          try {
            // Get current authenticated user attributes
            const currentUser = await Auth.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              localStorage.setItem('user', JSON.stringify(currentUser));

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
        console.log("User Signed In Successfully");
        if (!user) {
          throw new Error('Authentication failed');
        }
        setUser(user);
        console.log("USER: " + user);
        localStorage.setItem('user', JSON.stringify(user));
        return true;

      } else {
        // Use simple auth in development
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        // For demo, allow any non-empty values in dev
        const mockUser = {
          username: 'Username (Development)',
          name: 'Development User',
          email: email,
          dateOfBirth: '1990-01-01',
          lastLogin: new Date().toISOString(),
          authorizationHeaders: (type = 'application/json') => ({
            'Content-type': type,
            Authorization: 'Bearer mock-id-token',
          })
        };
  
        console.log(mockUser.authorizationHeaders());
        console.log("Mock User: ", mockUser);
  
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

  // Change password function
  const changePassword = async (oldPassword, newPassword) => {
    try {
      console.log('AuthContext changePassword called');

      if (!isProduction) {
        console.log('Mock changePassword in dev mode');
        // In dev mode, just return success
        return Promise.resolve({ success: true });
      }

      // For production, we'll use a completely different approach
      console.log('Production changePassword attempt');

      // Use direct API call to cognito
      try {
        // Get the current user
        const currentUser = await Auth.getCurrentUser();
        console.log('Current authenticated user:', currentUser);

        if (!currentUser) {
          throw new Error('No authenticated user found');
        }

        // The Cognito SDK allows us to call changePassword directly on the current user
        // This should work in v6 since it's a standard Cognito API
        if (typeof currentUser.changePassword === 'function') {
          console.log('Using currentUser.changePassword method');
          return await currentUser.changePassword(oldPassword, newPassword);
        }

        // Fallback for Amplify v6
        console.log('Trying alternate method with Auth object');
        // Use the Auth module directly which should have been initialized correctly
        return await Auth.changePassword(oldPassword, newPassword);
      } catch (error) {
        console.error('Change password error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Overall change password error:', error);
      throw error;
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
        Auth,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
