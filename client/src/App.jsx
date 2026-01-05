import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { AuthProvider } from "./contexts/auth-context"
import { ThemeProvider } from "./components/ui/theme-provider"
import { useAuth } from "./hooks/use-auth";

import Home from './pages/Home.jsx';
import HistoryPage from './pages/History.jsx';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import ForgotPassword from './pages/ForgotPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPage from './pages/PrivacyPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import GuestPage from './pages/GuestPage';



function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ats-defender-theme">
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * Active: 2026-01-05
 * Function: AppRoutes
 */
function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Home /> : <GuestPage />} />
      <Route path="/app" element={<Home />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/auth/signin" element={<SignInPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;