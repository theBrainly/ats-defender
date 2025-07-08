
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { AuthProvider } from "./contexts/auth-context"
import { ThemeProvider } from "./components/ui/theme-provider"

import Home from './pages/Home.jsx';
import HistoryPage from './pages/History.jsx';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import ForgotPassword from './pages/ForgotPassword';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';



function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ats-defender-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;