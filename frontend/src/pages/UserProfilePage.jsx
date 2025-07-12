import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext.jsx';
import SwapRequestModal from '../components/SwapRequestModal.jsx';

const getSkills = (skills = [], type) => {
  return skills.filter(skill => skill.skill_type === type);
};

function UserProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New state to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/users/${userId}`);
        setProfileUser(response.data);
      } catch  {
        setError('Could not load user profile. The user may not exist or the profile might be private.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profileUser) return <p>User not found.</p>;

  const skillsOffered = getSkills(profileUser.skills, 'offered');
  const skillsWanted = getSkills(profileUser.skills, 'wanted');
  const canRequestSwap = currentUser && currentUser.id !== profileUser.id;

  return (
    <>
      <div className="card shadow-lg">
        <div className="card-body p-md-5">
          <div className="row">
            <div className="col-md-4 text-center d-flex flex-column align-items-center">
              <img
                src={`https://i.pravatar.cc/150?u=${profileUser.email}`}
                alt={profileUser.name}
                className="rounded-circle mb-3 img-fluid shadow"
                style={{ maxWidth: '150px' }}
              />
              <h3 className="card-title">{profileUser.name}</h3>
              {profileUser.location && <p className="text-muted">{profileUser.location}</p>}
              
              {canRequestSwap && (
                <button className="btn btn-primary mt-3" onClick={handleShowModal}>
                  Request Swap
                </button>
              )}
               {!currentUser && (
                <Link to="/login" className="btn btn-primary mt-3">
                  Login to Request Swap
                </Link>
              )}
            </div>

            <div className="col-md-8">
              <h4 className="border-bottom pb-2 mb-3">Skills Offered</h4>
              {skillsOffered.length > 0 ? (
                skillsOffered.map(skill => (
                  <span key={skill.id} className="badge fs-6 bg-primary-subtle text-primary-emphasis rounded-pill me-2 mb-2 p-2">{skill.name}</span>
                ))
              ) : <p className="text-muted">This user hasn't listed any skills to offer yet.</p>}

              <h4 className="mt-4 border-bottom pb-2 mb-3">Skills Wanted</h4>
              {skillsWanted.length > 0 ? (
                skillsWanted.map(skill => (
                  <span key={skill.id} className="badge fs-6 bg-secondary-subtle text-secondary-emphasis rounded-pill me-2 mb-2 p-2">{skill.name}</span>
                ))
              ) : <p className="text-muted">This user hasn't listed any wanted skills yet.</p>}

              <hr className="my-4" />
              <div>
                <h5>Rating and Feedback</h5>
                <p className="text-muted">Feedback will be available after a completed swap.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SwapRequestModal 
        show={showModal} 
        handleClose={handleCloseModal} 
        targetUser={profileUser}
      />
    </>
  );
}

export default UserProfilePage;