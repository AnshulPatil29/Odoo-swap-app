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
    if (user) navigate('/');
    document.body.style.background = 'linear-gradient(-135deg, #12c2e9, #c471ed, #f64f59)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradient-animation 15s ease infinite';
    return () => { document.body.style.background = ''; document.body.style.animation = ''; }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, location, is_public: true });
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register.');
    } finally { setLoading(false); }
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '15px', color: 'white',
  };
  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.2)', border: 'none', color: 'white',
    borderBottom: '2px solid rgba(255, 255, 255, 0.4)', transition: 'border-color 0.3s ease'
  };

  return (
    <div className="row justify-content-center align-items-center" style={{minHeight: '80vh'}}>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg" style={cardStyle}>
          <div className="card-body p-4 p-md-5">
            <h2 className="card-title text-center mb-4">Create Account</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nameInput" className="form-label">Full Name</label>
                <input type="text" style={inputStyle} className="form-control" id="nameInput" value={name} onChange={(e) => setName(e.target.value)} required onFocus={e=>e.target.style.borderBottomColor='white'} onBlur={e=>e.target.style.borderBottomColor='rgba(255, 255, 255, 0.4)'}/>
              </div>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" style={inputStyle} className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required onFocus={e=>e.target.style.borderBottomColor='white'} onBlur={e=>e.target.style.borderBottomColor='rgba(255, 255, 255, 0.4)'}/>
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" style={inputStyle} className="form-control" id="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} required onFocus={e=>e.target.style.borderBottomColor='white'} onBlur={e=>e.target.style.borderBottomColor='rgba(255, 255, 255, 0.4)'}/>
              </div>
              <div className="mb-3">
                <label htmlFor="locationInput" className="form-label">Location (Optional)</label>
                <input type="text" style={inputStyle} className="form-control" id="locationInput" value={location} onChange={(e) => setLocation(e.target.value)} onFocus={e=>e.target.style.borderBottomColor='white'} onBlur={e=>e.target.style.borderBottomColor='rgba(255, 255, 255, 0.4)'}/>
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-light shiny-button" disabled={loading} style={{overflow: 'hidden', position: 'relative'}}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </div>
            </form>
            <div className="text-center mt-3 text-white-50">
              <span>Already have an account? </span>
              <Link to="/login" className="fw-bold text-white">Login here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;