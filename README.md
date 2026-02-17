# 🛡️ ATS Defender

**Optimize your resume for Applicant Tracking Systems and land your dream job!**
[![Project Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/theBrainly/ats-defender)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Powered by Vite](https://img.shields.io/badge/Powered%20by-Vite-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Styled with Tailwind](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

## 🚀 About

ATS Defender is a modern web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Built with React and Vite by **Akash Sharma**, it provides an intuitive interface for analyzing resumes against job descriptions and offering improvement suggestions.

## ✨ Features

- **🔍 Resume Analysis**: Upload and analyze your resume against job descriptions
- **📐 System Architecture**: [Read the full System Architecture](./SYSTEM_ARCHITECTURE.md)
- **📊 ATS Scoring**: Get detailed scoring on ATS compatibility
- **💡 Smart Suggestions**: Receive actionable recommendations for improvement
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔐 Secure Authentication**: Protected user accounts with JWT authentication
- **📝 Scan History**: Track your previous resume scans and improvements
- **🎨 Modern UI**: Clean, professional interface built with shadcn/ui components

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Styling**: shadcn/ui components
- **Icons**: Lucide React
- **Authentication**: JWT with secure context management
- **File Processing**: PDF.js, Mammoth.js for document parsing

## 🚀 Getting Started

### Prerequisites

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/theBrainly/ats-defender.git
   cd ats-defender
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client && npm install
   
   # Install server dependencies
   cd ../server && npm install
   ```

3. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd server && npm run dev
   
   # Frontend (Terminal 2)
   cd client && npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## 📖 Usage

1. **Sign Up/Sign In**: Create an account to access features
2. **Upload Resume**: Paste text or upload PDF/DOCX files
3. **Add Job Description**: Paste the target job description
4. **Analyze**: Get your ATS compatibility score
5. **Improve**: Follow suggestions to optimize your resume

## 👨‍💻 Developer

**Akash Sharma**

## � Contact

For questions or feedback, reach out via [GitHub Issues](https://github.com/theBrainly/ats-defender/issues) or email [officialmailakashsharma@gmail.com](mailto:officialmailakashsharma@gmail.com).
## 📞 Support

Need help? Contact us:
- 📧 **Email**: [officialmailakashsharma@gmail.com](mailto:officialmailakashsharma@gmail.com)
## 📄 License

**© 2025 Akash Sharma. All rights reserved.**

This project is proprietary software developed by Akash Sharma.

---

*Built with ❤️ using React + Vite*

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
```

## Environment Files

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## Additional Resources

