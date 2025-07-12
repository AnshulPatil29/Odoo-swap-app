import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const getSkills = (skills = [], type) => skills.filter(skill => skill.skill_type === type);

function EditProfilePage() {
    const { user, refetchUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillType, setNewSkillType] = useState('offered');
    const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });

    useEffect(() => {
        if (user) {
            setName(user.name); setLocation(user.location || ''); setIsPublic(user.is_public); setLoading(false);
        }
    }, [user]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdateStatus({ message: 'Saving...', type: 'info' });
        try {
            await api.put('/users/me', { name, location, is_public: isPublic });
            setUpdateStatus({ message: 'Profile updated successfully!', type: 'success' });
            refetchUser(); 
            setTimeout(() => setUpdateStatus({ message: '', type: '' }), 2000);
        } catch (error) {
            setUpdateStatus({ message: 'Failed to update profile.', type: 'danger' });
            console.error("Profile update failed", error);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkillName.trim()) return;
        try {
            await api.post('/users/me/skills', { name: newSkillName, skill_type: newSkillType });
            setNewSkillName(''); // Clear input
            refetchUser(); // Refetch to show new skill
        } catch (error) { console.error("Failed to add skill", error); alert("Could not add the skill."); }
    };

    const handleDeleteSkill = async (skillId) => {
        if (window.confirm("Are you sure?")) {
            try {
                await api.delete(`/users/me/skills/${skillId}`);
                refetchUser(); // Refetch to remove skill
            } catch (error) { console.error("Failed to delete skill", error); alert("Could not delete the skill."); }
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (!user) return <p>Could not load profile. Please try logging in again.</p>;

    const cardStyle = {
      background: 'rgba(30, 30, 40, 0.7)', backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff'
    };
    const inputStyle = { background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' };

    return (
        <div className="card shadow-lg" style={cardStyle}>
            <div className="card-header p-3 border-0"><h2 className="mb-0">Edit Your Profile</h2></div>
            <div className="card-body p-md-4">
                <div className="text-center mb-5">
                    <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt={name}
                        className="rounded-circle img-thumbnail mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover', background: 'transparent',
                                 border: '3px solid #0d6efd', animation: 'subtle-pulse 2s infinite' }}/>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h5 className="border-bottom pb-2 mb-3 border-secondary">Profile Settings</h5>
                        {updateStatus.message && <div className={`alert alert-${updateStatus.type}`}>{updateStatus.message}</div>}
                        <form onSubmit={handleProfileUpdate}>
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">Name</label>
                                <input id="userName" type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="userLocation" className="form-label">Location</label>
                                <input id="userLocation" type="text" className="form-control" placeholder="e.g., City, Country" value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}/>
                            </div>
                            <div className="form-check form-switch mb-3 fs-5">
                                <input id="isPublicSwitch" className="form-check-input" type="checkbox" role="switch" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                                <label className="form-check-label" htmlFor="isPublicSwitch">Make Profile Public</label>
                            </div>
                            <button type="submit" className="btn btn-primary shiny-button" style={{overflow: 'hidden', position: 'relative'}}>Save Profile</button>
                        </form>
                    </div>
                </div>
                <hr className="my-5 border-secondary" />
                <div className="row g-5">
                    <div className="col-md-6">
                        <h5>Your Skills</h5> <hr className="border-secondary"/>
                        <h6 className="text-muted">Skills You Offer</h6>
                        <div className="d-flex flex-wrap">
                            {getSkills(user.skills, 'offered').map(skill => (
                                <span key={skill.id} className="badge d-flex align-items-center fs-6 bg-primary-subtle text-primary-emphasis rounded-pill me-2 mb-2 p-2 ps-3">
                                    {skill.name}
                                    <button onClick={() => handleDeleteSkill(skill.id)} className="btn-close ms-2" style={{fontSize: '.65em'}} aria-label="Remove skill"></button>
                                </span>
                            ))}
                        </div>
                        <h6 className="text-muted mt-3">Skills You Want</h6>
                        <div className="d-flex flex-wrap">
                            {getSkills(user.skills, 'wanted').map(skill => (
                                <span key={skill.id} className="badge d-flex align-items-center fs-6 bg-success-subtle text-success-emphasis rounded-pill me-2 mb-2 p-2 ps-3">
                                    {skill.name}
                                    <button onClick={() => handleDeleteSkill(skill.id)} className="btn-close ms-2" style={{fontSize: '.65em'}} aria-label="Remove skill"></button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6 p-4 rounded" style={{background: 'rgba(0,0,0,0.2)'}}>
                        <h5 className="mb-3">Add a New Skill</h5>
                        <form onSubmit={handleAddSkill}>
                            <div className="mb-3">
                                <label htmlFor="skillName" className="form-label">Skill Name</label>
                                <input type="text" className="form-control" id="skillName" value={newSkillName} onChange={e => setNewSkillName(e.target.value)} placeholder="e.g., Guitar, Spanish" required style={inputStyle}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="skillType" className="form-label">Skill Type</label>
                                <select id="skillType" className="form-select" value={newSkillType} onChange={e => setNewSkillType(e.target.value)} style={inputStyle}>
                                    <option value="offered">I want to offer this skill</option>
                                    <option value="wanted">I want to learn this skill</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success w-100">Add Skill</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;