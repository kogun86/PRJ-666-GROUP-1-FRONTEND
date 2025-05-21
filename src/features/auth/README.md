# Authentication Feature

This module provides authentication functionality for the application. It supports both AWS Cognito in production and a simplified mock authentication in development.

## Structure

```
src/features/auth/
├── api/                 # API endpoints related to auth
├── context/             # Auth context for state management
│   └── AuthContext.js   # React context for auth state
├── hooks/               # Custom hooks
│   └── useAuthProtection.js # Hook to protect routes
├── lib/                 # Auth utilities
│   ├── amplifyClient.js # AWS Amplify configuration
│   └── index.js         # Auth lib exports
└── index.js             # Main exports for the feature
```

## Usage

### Import Auth Components

```jsx
// Import specific components
import { Auth, useAuth, AuthProvider, useAuthProtection } from '../features/auth';

// Or import everything
import authFeature from '../features/auth';
```

### Protect Routes

```jsx
import { useAuthProtection } from '../features/auth';

export default function ProtectedPage() {
  const { isLoading } = useAuthProtection();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Protected Content</div>;
}
```

### Access Auth Context

```jsx
import { useAuth } from '../features/auth';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Environment Configuration

This feature supports two environments:

1. **Development Mode**: Uses mock authentication, no real credentials needed
2. **Production Mode**: Uses AWS Cognito for authentication

Environment is detected using the `/api/auth/check-environment` endpoint.

## Required Environment Variables

For production mode, the following environment variables must be set:

```
NEXT_PUBLIC_AWS_COGNITO_REGION
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID
NEXT_PUBLIC_AWS_COGNITO_DOMAIN
NEXT_PUBLIC_SIGN_IN_REDIRECT_URL
NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL
```
