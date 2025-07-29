#!/bin/bash
# Deploy Hono app to Vercel

# Ensure Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI not found, installing..."
    npm install -g vercel
fi

# Deploy to Vercel
vercel --prod

echo "Deployment to Vercel completed."
