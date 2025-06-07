import { Amplify } from 'aws-amplify';
import {
  signIn,
  signOut,
  signUp,
  fetchUserAttributes,
  getCurrentUser,
  confirmSignUp,
  fetchAuthSession,
  // Import but don't use directly to avoid bundling issues
  // changePassword,
} from 'aws-amplify/auth';

// Remove debug logs which could cause issues
// console.log('Imported changePassword from aws-amplify/auth:', changePassword);
// console.log('Type of imported changePassword:', typeof changePassword);

/**
 * AWS Amplify configuration for authentication
 * This is the preferred authentication approach for the application.
 * It handles Cognito authentication directly from the client side.
 */

// Check if all required environment variables are set
const hasRequiredConfig =
  process.env.NEXT_PUBLIC_AWS_COGNITO_REGION &&
  process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID &&
  process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;

// Only configure Amplify if we have the required config
if (hasRequiredConfig) {
  Amplify.configure({
    Auth: {
      Cognito: {
        region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
        userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,

        loginWith: {
          oauth: {
            domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN || '',
            scopes: ['openid', 'email', 'phone', 'profile', 'aws.cognito.signin.user.admin'],
            redirectSignIn: [
              process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL || 'http://localhost:3000/dashboard',
            ],
            redirectSignOut: [
              process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL || 'http://localhost:3000/login',
            ],
            responseType: 'code',
          },
          username: true, // Enable username login
          email: false, // Disable email login
          phone: false, // Disable phone login
        },
      },
    },
  });

  console.log(
    'Amplify Cognito configured with region:',
    process.env.NEXT_PUBLIC_AWS_COGNITO_REGION
  );
} else {
  console.warn('Missing required Cognito configuration. Auth will not work in production mode.');
  // We don't configure Amplify, so production auth won't work
  // This is ok in development mode where we use mock auth
}

// Builds the user object
export async function formatUser(user) {
  let attributes = user.attributes;
  if (!attributes && user.userId) {
    attributes = await fetchUserAttributes();
  }
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken?.toString();

  return {
    username: user.username || user.userId,
    name: attributes?.name,
    email: attributes?.email,
    dateOfBirth: attributes?.birthdate,
    lastLogin: new Date().toISOString(),
    authorizationHeaders: (type = 'application/json') => ({
      'Content-Type': type,
      Authorization: `Bearer ${idToken || ''}`,
    }),
  };
}

// Create Auth object compatible with our app
const Auth = {
  getCurrentUser: async () => {
    // In development mode, return a mock user
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock user in development mode');
      return {
        username: 'mock-user',
        name: 'Mock User',
        email: 'mock@example.com',
        dateOfBirth: '2000-01-01',
        lastLogin: new Date().toISOString(),
        authorizationHeaders: (type = 'application/json') => ({
          'Content-Type': type,
          Authorization: 'Bearer mock-id-token',
        }),
      };
    }

    if (!hasRequiredConfig) {
      return null;
    }
    try {
      const user = await getCurrentUser();
      console.log('username: ', user.username);
      console.log('user ID: ', user.userId);
      console.log('user Sign In Details: ', user.signInDetails);
      return await formatUser(user);
    } catch (err) {
      console.error('Get User Error:', err);
      return null;
    }
  },
  signIn: async (username, password) => {
    if (!hasRequiredConfig) {
      return Promise.reject(
        new Error('Cognito configuration missing. Set required environment variables.')
      );
    }
    await signIn({ username, password });
    const user = await getCurrentUser();
    return await formatUser(user);
  },
  signOut: () => {
    if (!hasRequiredConfig) {
      return Promise.resolve();
    }
    return signOut();
  },
  signUp: (params) => {
    if (!hasRequiredConfig) {
      return Promise.reject(
        new Error('Cognito configuration missing. Set required environment variables.')
      );
    }
    return signUp(params);
  },
  confirmSignUp: (username, code) => {
    if (!hasRequiredConfig) {
      return Promise.reject(
        new Error('Cognito configuration missing. Set required environment variables.')
      );
    }
    return confirmSignUp({ username, confirmationCode: code });
  },
  userAttributes: () => {
    if (!hasRequiredConfig) {
      return Promise.resolve({});
    }
    return fetchUserAttributes();
  },
  currentAuthenticatedUser: () => {
    if (!hasRequiredConfig) {
      return Promise.reject(
        new Error('Cognito configuration missing. Set required environment variables.')
      );
    }
    return getCurrentUser();
  },
  // Update to use the Amplify global object directly
  changePassword: async (oldPassword, newPassword) => {
    if (!hasRequiredConfig) {
      return Promise.reject(
        new Error('Cognito configuration missing. Set required environment variables.')
      );
    }

    console.log('amplifyClient changePassword called');

    try {
      // Get the current authenticated user first
      const user = await getCurrentUser();
      console.log('Got current user:', user);

      // Try to access the global Amplify object directly
      if (typeof window !== 'undefined' && window.aws_amplify && window.aws_amplify.Auth) {
        console.log('Using global aws_amplify.Auth object');
        return await window.aws_amplify.Auth.changePassword({
          oldPassword,
          newPassword,
        });
      }

      // Try another approach with direct import
      try {
        const { changePassword: directChangePassword } = require('aws-amplify/auth');
        if (typeof directChangePassword === 'function') {
          console.log('Using required changePassword function');
          return await directChangePassword({
            oldPassword,
            newPassword,
          });
        }
      } catch (importError) {
        console.error('Failed to require aws-amplify/auth:', importError);
      }

      // As a last resort, use the direct API if the user object supports it
      if (user && typeof user.changePassword === 'function') {
        console.log('Using user.changePassword method');
        return await user.changePassword(oldPassword, newPassword);
      }

      // If all else fails
      throw new Error('Could not find a valid changePassword implementation');
    } catch (error) {
      console.error('changePassword implementation error:', error);
      throw error;
    }
  },
};

// Export Auth for use in components
export { Auth };
