import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import SwapDashboardPage from './pages/SwapDashboardPage.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="container py-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/swaps" 
            element={
              <ProtectedRoute>
                <SwapDashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default App;