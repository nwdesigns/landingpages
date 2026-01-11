#!/bin/bash
# Deploy to Vercel using token-based authentication
# Usage: ./deploy.sh [--preview]

set -e

# Load token from .env.deployment
if [ -f .env.deployment ]; then
  source .env.deployment
else
  echo "Error: .env.deployment not found"
  echo "Create it with: echo 'VERCEL_TOKEN=your_token' > .env.deployment"
  exit 1
fi

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Error: VERCEL_TOKEN not set in .env.deployment"
  exit 1
fi

# CRITICAL: --token flag must be passed explicitly!
if [ "$1" = "--preview" ]; then
  echo "Deploying preview..."
  vercel --token "$VERCEL_TOKEN" --yes
else
  echo "Deploying to production..."
  vercel --token "$VERCEL_TOKEN" --prod --yes
fi

echo "Done!"
