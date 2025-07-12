import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111' }}>
            <div className="spinner-grow text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    ); 
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;