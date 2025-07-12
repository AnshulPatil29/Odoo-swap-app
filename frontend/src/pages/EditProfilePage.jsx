import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const getSkills = (skills = [], type) => {
    return skills.filter(skill => skill.skill_type === type);
};

function EditProfilePage() {
    const { user, token } = useAuth(); 
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillType, setNewSkillType] = useState('offered');
    
    const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });
    useEffect(() => {
        if (user) {
            setName(user.name);
            setLocation(user.location || '');
            setIsPublic(user.is_public);
            setLoading(false);
        }
    }, [user, token]); 

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdateStatus({ message: 'Saving...', type: 'info' }); 
        try {
            await api.put('/users/me', { name, location, is_public: isPublic });
            setUpdateStatus({ message: 'Profile updated successfully!', type: 'success' });
            
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setUpdateStatus({ message: 'Failed to update profile. Please try again.', type: 'danger' });
            console.error("Profile update failed", error);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkillName.trim()) return;
        try {
            await api.post('/users/me/skills', { name: newSkillName, skill_type: newSkillType });
            window.location.reload();
        } catch (error) {
            console.error("Failed to add skill", error);
            alert("Could not add the skill.");
        }
    };
    
    const handleDeleteSkill = async (skillId) => {
        if (window.confirm("Are you sure you want to delete this skill?")) {
            try {
                await api.delete(`/users/me/skills/${skillId}`);
                window.location.reload();
            } catch (error) {
                console.error("Failed to delete skill", error);
                alert("Could not delete the skill.");
            }
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (!user) return <p>Could not load profile. Please try logging in again.</p>;
    
    const skillsOffered = getSkills(user.skills, 'offered');
    const skillsWanted = getSkills(user.skills, 'wanted');

    return (
        <div className="card shadow-lg">
            <div className="card-header p-3"><h2 className="mb-0">Edit Your Profile</h2></div>
            <div className="card-body p-md-4">
                
                <div className="text-center mb-5">
                    <img 
                        src={`https://i.pravatar.cc/150?u=${user.email}`} 
                        alt={name} 
                        className="rounded-circle img-thumbnail mb-3"
                        style={{width: '150px', height: '150px', objectFit: 'cover'}}
                    />
                    <div>
                        <button className="btn btn-secondary btn-sm" disabled>
                            Upload New Photo (Not Implemented)
                        </button>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h5 className="border-bottom pb-2 mb-3">Profile Settings</h5>
                        {updateStatus.message && <div className={`alert alert-${updateStatus.type}`}>{updateStatus.message}</div>}
                        <form onSubmit={handleProfileUpdate}>
                            <div className="mb-3">
                                <label htmlFor="userName" className="form-label">Name</label>
                                <input id="userName" type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="userLocation" className="form-label">Location</label>
                                <input id="userLocation" type="text" className="form-control" placeholder="e.g., City, Country" value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <div className="form-check form-switch mb-3">
                                <input id="isPublicSwitch" className="form-check-input" type="checkbox" role="switch" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
                                <label className="form-check-label" htmlFor="isPublicSwitch">Make Profile Public</label>
                            </div>
                            <button type="submit" className="btn btn-primary">Save Profile Changes</button>
                        </form>
                    </div>
                </div>

                <hr className="my-5" />

                <div className="row g-5">
                    <div className="col-md-6">
                        <h5>Your Skills</h5>
                        <hr/>
                        <h6 className="text-muted">Skills You Offer</h6>
                        <div className="d-flex flex-wrap">
                            {skillsOffered.length > 0 ? (
                                skillsOffered.map(skill => (
                                    <span key={skill.id} className="badge d-flex align-items-center fs-6 bg-primary-subtle text-primary-emphasis rounded-pill me-2 mb-2 p-2 ps-3">
                                        {skill.name}
                                        <button onClick={() => handleDeleteSkill(skill.id)} className="btn-close ms-2" style={{fontSize: '.65em'}} aria-label="Remove skill"></button>
                                    </span>
                                ))
                            ) : <p className="text-muted fst-italic">You haven't added any offered skills.</p>}
                        </div>
                        
                        <h6 className="text-muted mt-3">Skills You Want</h6>
                        <div className="d-flex flex-wrap">
                            {skillsWanted.length > 0 ? (
                                skillsWanted.map(skill => (
                                    <span key={skill.id} className="badge d-flex align-items-center fs-6 bg-secondary-subtle text-secondary-emphasis rounded-pill me-2 mb-2 p-2 ps-3">
                                        {skill.name}
                                        <button onClick={() => handleDeleteSkill(skill.id)} className="btn-close ms-2" style={{fontSize: '.65em'}} aria-label="Remove skill"></button>
                                    </span>
                                ))
                            ) : <p className="text-muted fst-italic">You haven't added any wanted skills.</p>}
                        </div>
                    </div>

                    <div className="col-md-6 bg-light p-4 rounded border">
                        <h5 className="mb-3">Add a New Skill</h5>
                        <form onSubmit={handleAddSkill}>
                            <div className="mb-3">
                                <label htmlFor="skillName" className="form-label">Skill Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="skillName"
                                    value={newSkillName}
                                    onChange={e => setNewSkillName(e.target.value)}
                                    placeholder="e.g., Guitar, Spanish, Baking"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="skillType" className="form-label">Skill Type</label>
                                <select 
                                    id="skillType" 
                                    className="form-select"
                                    value={newSkillType}
                                    onChange={e => setNewSkillType(e.target.value)}
                                >
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