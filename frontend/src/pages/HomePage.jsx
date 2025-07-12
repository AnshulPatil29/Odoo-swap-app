import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import UserCard from '../components/UserCard.jsx';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/');
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
        <div className="spinner-border text-primary" style={{width: '4rem', height: '4rem'}} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  const titleStyle = {
    fontSize: 'clamp(2rem, 10vw, 4.5rem)',
    fontWeight: '900',
    background: 'linear-gradient(45deg, #0d6efd, #0dcaf0, #d63384)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 style={titleStyle}>Explore & Connect</h1>
        <p className="lead text-white-50">Find talented individuals to swap skills with.</p>
      </div>
      
      <div className="row g-4">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div key={user.id} className="col-lg-4 col-md-6 mb-4" style={{ animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`, opacity: 0 }}>
              <UserCard user={user} />
            </div>
          ))
        ) : <p className="text-white-50">No public profiles found.</p>}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;