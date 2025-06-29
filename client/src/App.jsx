
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { AuthProvider } from "./hooks/use-auth"

import Home from './pages/Home.jsx';
import HistoryPage from './pages/History.jsx';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';



function App() {
  return (
    <AuthProvider>
    <Router>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/auth/signin" element={<SignInPage />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
        <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
         <Route path="/profile" element={<ProfilePage />} />
         
         
          
      </Routes>
    </Router>
    </AuthProvider>
   
    
  );
}

export default App;