#!/bin/bash

# Force development mode to use mock authentication
export NODE_ENV=development

# Run Next.js development server
echo "Starting in DEVELOPMENT mode with mock authentication..."
npm run dev 
