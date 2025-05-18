import { Amplify } from 'aws-amplify';
import { signIn, signOut, signUp, fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';

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

// Create Auth object compatible with our app
const Auth = {
  signIn: (username, password) => {
    if (!hasRequiredConfig) {
      return Promise.reject(
        new Error('Cognito configuration missing. Set required environment variables.')
      );
    }
    return signIn({ username, password });
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
};

// Export Auth for use in components
export { Auth };
