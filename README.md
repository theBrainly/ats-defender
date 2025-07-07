# ATS Defender

ATS Defender is an application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The application analyzes resumes against job descriptions to provide detailed feedback and suggestions for improvement.

## Project Structure

This project is organized as a monorepo with two main components:

- **client**: A React/Vite frontend application
- **server**: A Node.js/Express backend API

## Deployment to Vercel

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- [Node.js](https://nodejs.org/) (v16 or newer)
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for command-line deployment)

### Automatic Deployment

The easiest way to deploy is using our deployment script:

```bash
./deploy.sh
```

This will guide you through the deployment process.

### Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy the application:
   ```bash
   vercel --prod
   ```

4. Follow the interactive prompts to complete deployment.

### Environment Variables

After deployment, set these environment variables in the Vercel dashboard:

1. Go to your project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

**Required Variables:**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `CORS_ALLOWED_ORIGINS`: Your production domain
- `AI_SERVICE_URL`: Your AI service URL
- `AI_API_KEY`: Your AI service API key

### Custom Domain Setup

1. In the Vercel dashboard, go to your project settings
2. Navigate to Domains
3. Add your custom domain and follow the verification steps

## Local Development

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

## Environment Files

- `.env.development`: Development environment variables
- `.env.production`: Production environment variables
- `.env.example`: Example environment file (safe to commit)

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
