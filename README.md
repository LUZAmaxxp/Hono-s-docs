# Hono-s-docs

## Project Overview

This project is a simple authentication application built using the Hono framework. It demonstrates basic user registration, login, and protected route access using JSON Web Tokens (JWT) for authentication.

## Features

- User registration via the `/register` endpoint.
- User login via the `/login` endpoint, which returns a JWT token.
- Protected route `/profile` that requires a valid JWT token to access.
- Logout endpoint `/logout` (for demonstration purposes; token invalidation is not implemented).
- User data is stored in-memory, and passwords are stored in plain text (not recommended for production).

## Technology Stack

- [Hono](https://hono.dev/) - A small, fast web framework for building web applications.
- [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication.
- [Undici](https://github.com/nodejs/undici) - HTTP client used for request handling in the server.

## Running the Server

To start the server, run the following command:

```bash
node hono-auth-app/src/server.ts
```

The server listens on port 3000 by default. You can then interact with the API endpoints using tools like curl or Postman.

## Deployment

This project includes deployment scripts for various platforms:

- **AWS Lambda**: Use the `deploy-aws.sh` script to deploy the app using AWS SAM. Make sure to configure your AWS CLI and replace the S3 bucket name in the script.

- **Azure Functions**: Use the `deploy-azure.sh` script to deploy the app to Azure Functions. This script creates the necessary resource group, storage account, and function app before deploying.

- **Vercel**: Use the `deploy-vercel.sh` script to deploy the app to Vercel. The script installs the Vercel CLI if not present and deploys the app to the production environment.


