import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

const getSkills = (skills = [], type) => {
    return skills.filter(skill => skill.skill_type === type);
};

function SwapRequestModal({ show, handleClose, targetUser }) {
    const { user: currentUser } = useAuth();
    const [myOfferedSkillId, setMyOfferedSkillId] = useState('');
    const [theirWantedSkillId, setTheirWantedSkillId] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show && currentUser && targetUser) {
            setError(''); setSuccess(''); setLoading(false); setMessage('');
            const mySkillsToOffer = getSkills(currentUser.skills, 'offered');
            const theirSkillsToGet = getSkills(targetUser.skills, 'wanted');
            setMyOfferedSkillId(mySkillsToOffer.length > 0 ? mySkillsToOffer[0].id : '');
            setTheirWantedSkillId(theirSkillsToGet.length > 0 ? theirSkillsToGet[0].id : '');
        }
    }, [show, currentUser, targetUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        if (!myOfferedSkillId || !theirWantedSkillId) {
            setError("You must select a skill to offer and a skill to receive.");
            setLoading(false); return;
        }
        try {
            await api.post('/swaps/', {
                provider_id: targetUser.id,
                offered_skill_id: parseInt(myOfferedSkillId, 10),
                wanted_skill_id: parseInt(theirWantedSkillId, 10),
                message: message,
            });
            setSuccess(`Swap request sent to ${targetUser.name}!`);
            setTimeout(() => { handleClose(); }, 2000);
        } catch (err) {
            setError("Failed to send swap request. Please try again.");
            console.error(err);
        } finally { setLoading(false); }
    };

    if (!show) return null;

    const mySkillsToOffer = getSkills(currentUser?.skills, 'offered');
    const theirSkillsToGet = getSkills(targetUser?.skills, 'wanted');

    const modalStyle = {
      animation: 'modal-fade-in 0.3s ease-out forwards',
      background: 'rgba(30, 30, 40, 0.85)',
      backdropFilter: 'blur(10px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.125)',
      color: 'white',
      boxShadow: '0 0 50px rgba(0, 0, 0, 0.5)',
    };

    return (
        <>
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={modalStyle}>
                        <div className="modal-header border-bottom-0">
                            <h5 className="modal-title">Request a Swap with {targetUser?.name}</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={handleClose} disabled={loading}></button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger animate__animated animate__shakeX">{error}</div>}
                            {success && <div className="alert alert-success animate__animated animate__tada">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="mySkill" className="form-label">You Offer:</label>
                                    <select id="mySkill" className="form-select" value={myOfferedSkillId} onChange={e => setMyOfferedSkillId(e.target.value)} required disabled={mySkillsToOffer.length === 0} style={{...modalStyle, color:'white'}}>
                                        {mySkillsToOffer.length > 0 ? mySkillsToOffer.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>) : <option>You have no skills to offer.</option>}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="theirSkill" className="form-label">You Want:</label>
                                    <select id="theirSkill" className="form-select" value={theirWantedSkillId} onChange={e => setTheirWantedSkillId(e.target.value)} required disabled={theirSkillsToGet.length === 0} style={{...modalStyle, color:'white'}}>
                                        {theirSkillsToGet.length > 0 ? theirSkillsToGet.map(skill => <option key={skill.id} value={skill.id}>{skill.name}</option>) : <option>They are not looking for any skills.</option>}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message (Optional)</label>
                                    <textarea id="message" className="form-control" rows="3" placeholder="Add a friendly message..." value={message} onChange={e => setMessage(e.target.value)} style={{...modalStyle, color:'white'}}></textarea>
                                </div>
                                <div className="modal-footer border-top-0 pb-0">
                                    <button type="button" className="btn btn-outline-secondary" onClick={handleClose} disabled={loading}>Cancel</button>
                                    <button type="submit" className="btn btn-primary shiny-button" disabled={loading || success || mySkillsToOffer.length === 0 || theirSkillsToGet.length === 0} style={{overflow:'hidden', position:'relative'}}>
                                        {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : (success ? 'Sent!' : 'Submit Request')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" style={{backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0,0,0,0.5)'}}></div>
        </>
    );
}

export default SwapRequestModal;