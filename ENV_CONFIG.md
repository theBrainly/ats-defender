# Environment Configuration Guide

This document outlines the environment variables required for the ATS Defender application. Both the client and server components require specific environment variables to function correctly.

## Client Environment Variables

Create a `.env` file in the `client` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Authentication
VITE_AUTH_DOMAIN=your-auth-domain
VITE_AUTH_CLIENT_ID=your-auth-client-id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
```

## Server Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ats-defender

# JWT Authentication
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# API Services
AI_SERVICE_URL=https://your-ai-service-url.com/api
AI_API_KEY=your-ai-service-api-key

# Logging
LOG_LEVEL=debug
```

## Example Usage

In both client and server code, environment variables are accessed differently:

### Client (React/Vite)

```javascript
// Using import.meta.env for Vite projects
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Example API call
fetch(`${apiBaseUrl}/endpoint`);
```

### Server (Node.js)

```javascript
// Using process.env for Node.js
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ats-defender';

// Example usage
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## Development Best Practices

1. **Never commit .env files to version control**
   - Add `.env` and `.env.*` to your `.gitignore` file
   - Provide `.env.example` files with placeholder values

2. **Use environment-specific files**
   - `.env.development` for development environment
   - `.env.production` for production environment
   - `.env.test` for testing environment

3. **Validate required environment variables on startup**
   - Add validation logic to ensure all required variables are set
   - Fail fast if critical environment variables are missing

## Deployment

When deploying to production environments, ensure all environment variables are properly set in your hosting platform's environment configuration:

- For Vercel: Use the Environment Variables section in project settings
- For Heroku: Set Config Vars in the Settings tab
- For AWS: Use Parameter Store or Secrets Manager
- For Docker: Use Docker environment files or Docker Compose environment variables

## Security Considerations

- Use different values for sensitive variables in development and production
- Rotate secrets periodically, especially if there's any suspicion of compromise
- Limit environment variable access to only the services that need them
- Consider using a secrets management service for production environments
