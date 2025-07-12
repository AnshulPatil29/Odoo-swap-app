import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import UserCard from '../components/UserCard.jsx';

function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // mounting
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
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Explore Profiles</h1>
      <div className="row mb-4">
        <div className="col-md-8">
          <input type="text" className="form-control" placeholder="Search by skill (e.g., Photoshop, Excel)..." />
        </div>
        <div className="col-md-4">
          <select className="form-select">
            <option selected>Filter by Availability...</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
          </select>
        </div>
      </div>

      <div className="row">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="col-lg-4 col-md-6 mb-4">
              <UserCard user={user} />
            </div>
          ))
        ) : (
          <p>No public profiles found.</p>
        )}
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
          <li className="page-item active"><a className="page-link" href="#">1</a></li>
          <li className="page-item"><a className="page-link" href="#">2</a></li>
          <li className="page-item"><a className="page-link" href="#">3</a></li>
          <li className="page-item"><a className="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;