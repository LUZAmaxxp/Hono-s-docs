#!/bin/bash
# Deploy Hono app to AWS Lambda using AWS SAM

# Set variables
STACK_NAME="hono-auth-stack"
REGION="us-east-1"

# Build the project
npm run build

# Package and deploy using AWS SAM
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket your-s3-bucket-name

sam deploy --template-file packaged.yaml --stack-name $STACK_NAME --capabilities CAPABILITY_IAM --region $REGION

echo "Deployment to AWS Lambda completed."
