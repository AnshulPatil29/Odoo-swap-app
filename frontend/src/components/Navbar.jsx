import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1050,
  };

  const brandStyle = {
    fontWeight: 'bold',
    fontSize: '1.5rem',
    background: 'linear-gradient(45deg, #007bff, #6610f2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid rgba(0, 123, 255, 0.7)',
    boxShadow: '0 0 15px rgba(0, 123, 255, 0.5)',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={navStyle}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={brandStyle}>
          Skill Swap
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => {}}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="d-flex ms-auto align-items-center" ref={dropdownRef}>
          {user ? (
            <>
              <NavLink
                className="nav-link me-3"
                to="/swaps"
                style={{ color: 'rgba(255,255,255,0.8)', transition: 'all .3s' }}
                activeStyle={{ color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.7)' }}
              >
                Swap Requests
              </NavLink>

              <button
                type="button"
                className="btn p-0 nav-link dropdown-toggle"
                aria-expanded={isDropdownOpen}
                onClick={() => setDropdownOpen(o => !o)}
              >
                <img
                  src={user.avatar || `https://i.pravatar.cc/40?u=${user.email}`}
                  alt={user.name}
                  style={avatarStyle}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-dark dropdown-menu-end${isDropdownOpen ? ' show' : ''}`}
                style={{
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(5px)',
                  marginTop: '10rem', 
                }}
              >
                <li>
                  <Link className="dropdown-item" to="/profile">
                    {user.name}'s Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <NavLink
              className="btn btn-outline-primary shiny-button"
              to="/login"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
