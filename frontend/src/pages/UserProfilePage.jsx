import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';

const getSkills = (skills = [], type) => skills.filter(skill => skill.skill_type === type);

function UserProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true); setError('');
      try {
        const response = await api.get(`/users/${userId}`);
        setProfileUser(response.data);
      } catch { setError('Could not load user profile.'); } 
      finally { setLoading(false); }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }} role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profileUser) return <p className="text-white">User not found.</p>;

  const canRequestSwap = currentUser && currentUser.id !== profileUser.id;
  const cardStyle = {
      background: 'linear-gradient(160deg, rgba(40, 42, 54, 0.9) 0%, rgba(28, 30, 40, 0.95) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f8f9fa',
  };
  const skillBadgeStyle = { transition: 'transform 0.2s ease, box-shadow 0.2s ease' };

  return (
    <>
      <div className="card shadow-lg" style={cardStyle}>
        <div className="card-body p-md-5">
          <div className="row">
            <div className="col-md-4 text-center d-flex flex-column align-items-center">
              <img src={`https://i.pravatar.cc/150?u=${profileUser.email}`} alt={profileUser.name}
                className="rounded-circle mb-3 img-fluid"
                style={{ maxWidth: '150px', border: '4px solid #0d6efd', animation: 'subtle-pulse 2s infinite ease-in-out' }}/>
              <h3 className="card-title">{profileUser.name}</h3>
              {profileUser.location && <p className="text-white-50">{profileUser.location}</p>}
              {canRequestSwap && <button className="btn btn-primary mt-3 shiny-button" onClick={() => setShowModal(true)} style={{overflow: 'hidden', position: 'relative'}}>Request Swap</button>}
              {!currentUser && <Link to="/login" className="btn btn-primary mt-3 shiny-button" style={{overflow: 'hidden', position: 'relative'}}>Login to Request Swap</Link>}
            </div>
            <div className="col-md-8">
              <h4 className="border-bottom border-secondary pb-2 mb-3">Skills Offered</h4>
              {getSkills(profileUser.skills, 'offered').length > 0 ? (
                getSkills(profileUser.skills, 'offered').map(skill => (
                  <span key={skill.id} className="badge fs-6 bg-primary-subtle text-primary-emphasis rounded-pill me-2 mb-2 p-2" style={skillBadgeStyle} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>{skill.name}</span>
                ))
              ) : <p className="text-white-50">This user hasn't listed any skills to offer yet.</p>}

              <h4 className="mt-4 border-bottom border-secondary pb-2 mb-3">Skills Wanted</h4>
              {getSkills(profileUser.skills, 'wanted').length > 0 ? (
                getSkills(profileUser.skills, 'wanted').map(skill => (
                  <span key={skill.id} className="badge fs-6 bg-success-subtle text-success-emphasis rounded-pill me-2 mb-2 p-2" style={skillBadgeStyle} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>{skill.name}</span>
                ))
              ) : <p className="text-white-50">This user hasn't listed any wanted skills yet.</p>}
            </div>
          </div>
        </div>
      </div>
      <SwapRequestModal show={showModal} handleClose={() => setShowModal(false)} targetUser={profileUser}/>
    </>
  );
}

export default UserProfilePage;