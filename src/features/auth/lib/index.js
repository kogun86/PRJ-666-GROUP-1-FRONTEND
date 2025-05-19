/**
 * Auth module exports
 * This file centralizes all authentication-related exports
 */

// Only import real Auth in production, use mock in development
let Auth;

// Environment check helper function
export const isProduction = () => {
  // Force development mode if missing required credentials
  const hasCognitoConfig =
    process.env.NEXT_PUBLIC_AWS_COGNITO_REGION &&
    process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID &&
    process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;

  // Return boolean value explicitly
  return process.env.NODE_ENV === 'production' && hasCognitoConfig ? true : false;
};

// In development mode, provide mock Auth
if (!isProduction()) {
  console.log('Using development authentication mode');

  // Create mock Auth for development
  Auth = {
    signIn: (username, password) => Promise.resolve({ username }),
    signOut: () => Promise.resolve(),
    signUp: (params) => Promise.resolve({ user: params }),
    userAttributes: () => Promise.resolve({}),
    currentAuthenticatedUser: () => Promise.reject(new Error('No authenticated user in dev mode')),
    changePassword: (oldPassword, newPassword) => {
      // Check if parameters are provided to match Amplify's behavior
      if (!oldPassword || !newPassword) {
        return Promise.reject(new Error('oldPassword and newPassword are required'));
      }
      console.log('Mock changePassword called with', { oldPassword, newPassword });
      return Promise.resolve({ success: true });
    },
  };
} else {
  // In production, import the real Auth implementation
  const { Auth: AmplifyAuth } = require('./amplifyClient');
  Auth = AmplifyAuth;
}

// Re-export Auth
export { Auth };

// Export default object with all auth utilities
export default {
  Auth,
  isProduction,
};
