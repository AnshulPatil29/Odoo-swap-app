import React from 'react';
import { Link } from 'react-router-dom';

const getSkills = (skills, type) => {
  return skills.filter(skill => skill.skill_type === type);
};

function UserCard({ user }) {
  const skillsOffered = getSkills(user.skills, 'offered');
  const skillsWanted = getSkills(user.skills, 'wanted');

  const cardStyle = {
    background: 'linear-gradient(135deg, rgba(40, 42, 54, 0.8), rgba(28, 30, 40, 0.9))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '15px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    color: '#f8f9fa',
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const rotateX = (-y / height) * 10;
    const rotateY = (x / width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.boxShadow = `0 40px 50px -20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(104, 213, 255, 0.5)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div className="card h-100" style={cardStyle} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img
            src={`https://i.pravatar.cc/60?u=${user.email}`}
            alt={user.name}
            className="rounded-circle me-3"
            style={{ width: '60px', height: '60px', objectFit: 'cover', border: '2px solid #0dcaf0' }}
          />
          <div>
            <h5 className="card-title mb-0">{user.name}</h5>
            {user.location && <p className="card-text text-white-50">{user.location}</p>}
          </div>
        </div>

        <div>
          <h6 className="text-info-emphasis small text-uppercase">Offers</h6>
          <div className="mb-2">
            {skillsOffered.length > 0 ? (
              skillsOffered.map(skill => <span key={skill.id} className="badge bg-primary-subtle text-primary-emphasis rounded-pill me-1 mb-1">{skill.name}</span>)
            ) : <p className="small text-white-50 fst-italic">No skills offered yet.</p>}
          </div>
        </div>

        <div>
          <h6 className="text-success-emphasis small text-uppercase">Wants</h6>
          <div>
            {skillsWanted.length > 0 ? (
              skillsWanted.map(skill => <span key={skill.id} className="badge bg-success-subtle text-success-emphasis rounded-pill me-1 mb-1">{skill.name}</span>)
            ) : <p className="small text-white-50 fst-italic">No skills wanted yet.</p>}
          </div>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 p-3">
        <Link to={`/user/${user.id}`} className="btn btn-outline-info w-100 shiny-button" style={{position:'relative', overflow:'hidden'}}>
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default UserCard;