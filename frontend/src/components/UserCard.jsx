import React from 'react';
import { Link } from 'react-router-dom';

const getSkills = (skills, type) => {
  return skills.filter(skill => skill.skill_type === type);
};

function UserCard({ user }) {
  const skillsOffered = getSkills(user.skills, 'offered');
  const skillsWanted = getSkills(user.skills, 'wanted');

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <img
            src={`https://i.pravatar.cc/60?u=${user.email}`}
            alt={user.name}
            className="rounded-circle me-3"
            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
          />
          <div>
            <h5 className="card-title mb-0">{user.name}</h5>
            {user.location && <p className="card-text text-muted">{user.location}</p>}
          </div>
        </div>

        <div>
          <h6 className="text-muted small text-uppercase">Offers</h6>
          <div className="mb-2">
            {skillsOffered.length > 0 ? (
              skillsOffered.map(skill => (
                <span key={skill.id} className="badge bg-primary-subtle text-primary-emphasis rounded-pill me-1 mb-1">
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="small text-muted fst-italic">No skills offered yet.</p>
            )}
          </div>
        </div>

        <div>
          <h6 className="text-muted small text-uppercase">Wants</h6>
          <div>
            {skillsWanted.length > 0 ? (
              skillsWanted.map(skill => (
                <span key={skill.id} className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill me-1 mb-1">
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="small text-muted fst-italic">No skills wanted yet.</p>
            )}
          </div>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 p-3">
        <Link to={`/user/${user.id}`} className="btn btn-outline-primary w-100">
          View Profile & Request Swap
        </Link>
      </div>
    </div>
  );
}

export default UserCard;