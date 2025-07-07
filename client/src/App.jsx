
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
            <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />



          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;