/**
 * Authentication Feature exports
 * This file centralizes all auth-related exports from the auth feature
 */

// Re-export from lib
export { Auth, isProduction } from './lib';

// Re-export from context
export { AuthProvider, useAuth } from './context/AuthContext';

// Re-export from hooks
export { default as useAuthProtection } from './hooks/useAuthProtection';

// Export a feature object with everything
export default {
  Auth: require('./lib').Auth,
  isProduction: require('./lib').isProduction,
  AuthProvider: require('./context/AuthContext').AuthProvider,
  useAuth: require('./context/AuthContext').useAuth,
  useAuthProtection: require('./hooks/useAuthProtection').default,
};
