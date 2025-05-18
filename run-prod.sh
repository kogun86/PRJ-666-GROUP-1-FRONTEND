#!/bin/bash

# Load environment variables from .env.local if it exists
if [ -f .env.local ]; then
  echo "Loading environment variables from .env.local..."
  export $(grep -v '^#' .env.local | xargs)
else
  echo "Warning: .env.local file not found"
fi

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_AWS_COGNITO_REGION" ] || [ -z "$NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID" ] || [ -z "$NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID" ]; then
  echo "Error: Missing required environment variables."
  echo "Please set the following environment variables in .env.local:"
  echo "- NEXT_PUBLIC_AWS_COGNITO_REGION"
  echo "- NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID"
  echo "- NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID"
  echo "- NEXT_PUBLIC_AWS_COGNITO_DOMAIN"
  echo "- NEXT_PUBLIC_SIGN_IN_REDIRECT_URL"
  echo "- NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL"
  echo ""
  echo "Example .env.local file:"
  echo "NEXT_PUBLIC_AWS_COGNITO_REGION=us-east-1"
  echo "NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your-pool-id"
  echo "NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=your-client-id"
  echo ""
  echo "Would you like to continue in development mode instead? (y/n)"
  read answer
  if [ "$answer" != "${answer#[Yy]}" ]; then
    export NODE_ENV=development
    echo "Starting in DEVELOPMENT mode with mock authentication..."
    npm run dev
    exit 0
  else
    exit 1
  fi
fi

# Now print the loaded variables to verify
echo "Using the following configuration:"
echo "- NEXT_PUBLIC_AWS_COGNITO_REGION: $NEXT_PUBLIC_AWS_COGNITO_REGION"
echo "- NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID: $NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID"
echo "- NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID: $NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID"
echo "- NEXT_PUBLIC_AWS_COGNITO_DOMAIN: $NEXT_PUBLIC_AWS_COGNITO_DOMAIN"

# Force production mode
export NODE_ENV=production

# Build and start the application
echo "Starting in PRODUCTION mode with Cognito authentication..."
npm run build && npm start 
