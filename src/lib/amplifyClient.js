import { Amplify, Auth } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID,

      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN, // e.g., your-app.auth.us-east-1.amazoncognito.com
          scopes: ['openid', 'email', 'phone', 'profile', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [
            process.env.NEXT_PUBLIC_SIGN_IN_REDIRECT_URL ,
          ],
          redirectSignOut: [
            process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL ,
          ],
          responseType: 'code',
        },
        username: true,  // Enable username login
        email: false,    // Disable email login
        phone: false     // Disable phone login
      },
    },
  },
});