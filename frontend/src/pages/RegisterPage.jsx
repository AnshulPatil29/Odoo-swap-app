import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      await api.post('/auth/register', {
        name,
        email,
        password,
        location,
        is_public: true 
      });

      await login(email, password);

      navigate('/');
    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(err.response.data.detail); 
      } else {
        setError('Failed to register. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Create Account</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameInput"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="locationInput" className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  id="locationInput"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to="/login">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;