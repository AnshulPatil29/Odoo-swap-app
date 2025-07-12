import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
    document.body.style.background = 'linear-gradient(135deg, #232526, #414345)';
    document.body.style.backgroundSize = '400% 400%';
    document.body.style.animation = 'gradient-animation 15s ease infinite';
    return () => { document.body.style.background = ''; document.body.style.animation = ''; }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally { setLoading(false); }
  };

  const cardStyle = {
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    color: 'white',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    transition: 'border-color 0.3s ease'
  };

  return (
    <div className="row justify-content-center align-items-center" style={{minHeight: '80vh'}}>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-lg" style={cardStyle}>
          <div className="card-body p-4 p-md-5">
            <h2 className="card-title text-center mb-4">Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" style={inputStyle} className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" onFocus={e=>e.target.style.borderBottomColor='#0d6efd'} onBlur={e=>e.target.style.borderBottomColor='rgba(255, 255, 255, 0.3)'}/>
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" style={inputStyle} className="form-control" id="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" onFocus={e=>e.target.style.borderBottomColor='#0d6efd'} onBlur={e=>e.target.style.borderBottomColor='rgba(255, 255, 255, 0.3)'}/>
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary shiny-button" disabled={loading} style={{overflow: 'hidden', position: 'relative'}}>
                  {loading ? <span className="spinner-border spinner-border-sm" /> : 'Login'}
                </button>
              </div>
            </form>
            <div className="text-center mt-3 text-white-50">
                <p className="mb-0">Don't have an account? <Link to="/register" className="fw-bold text-info">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;