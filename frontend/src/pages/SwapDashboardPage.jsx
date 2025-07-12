import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

function SwapDashboardPage() {
    const { user: currentUser } = useAuth();
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSwaps = async () => {
        if (!currentUser) return;
        try {
            const response = await api.get('/swaps/me');
            setSwaps(response.data);
        } catch (err) {
            setError('Failed to load swap requests.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSwaps(); }, [currentUser]);

    const handleRespond = async (swapId, response) => {
        if (!window.confirm(`Are you sure you want to ${response} this swap?`)) return;
        try {
            await api.put(`/swaps/${swapId}/respond?response=${response}`);
            fetchSwaps(); // Refetch data instead of reloading
        } catch { alert('Failed to respond to swap.'); }
    };

    if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    const renderSwapCard = (swap) => {
        const isRequester = swap.requester.id === currentUser.id;
        const otherUser = isRequester ? swap.provider : swap.requester;
        const statusColors = { pending: '#ffc107', accepted: '#198754', rejected: '#dc3545' };
        
        const cardStyle = {
            background: 'rgba(40, 42, 54, 0.7)', backdropFilter: 'blur(5px)', color: 'white',
            borderLeft: `5px solid ${statusColors[swap.status]}`,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
        };

        return (
            <div key={swap.id} className="card mb-3 shadow-sm" style={cardStyle} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="card-body d-flex justify-content-between align-items-center flex-column flex-md-row">
                    <div className="me-3 mb-2 mb-md-0">
                        {isRequester ? (
                            <p className="mb-0">You requested <strong>{swap.wanted_skill.name}</strong> from <Link to={`/user/${otherUser.id}`} className="text-info">{otherUser.name}</Link>.</p>
                        ) : (
                            <p className="mb-0"><Link to={`/user/${otherUser.id}`} className="text-info">{otherUser.name}</Link> requested your <strong>{swap.offered_skill.name}</strong>.</p>
                        )}
                        <small className="text-white-50">In exchange for your {swap.offered_skill.name} skill.</small>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className={`badge me-3 fs-6 bg-${swap.status === 'accepted' ? 'success' : swap.status === 'rejected' ? 'danger' : 'warning text-dark'}`}>{swap.status}</span>
                        {!isRequester && swap.status === 'pending' && (
                            <div className="btn-group">
                                <button className="btn btn-sm btn-success" onClick={() => handleRespond(swap.id, 'accepted')}>Accept</button>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleRespond(swap.id, 'rejected')}>Reject</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const incoming = swaps.filter(s => s.provider.id === currentUser.id && s.status === 'pending');
    const outgoing = swaps.filter(s => s.requester.id === currentUser.id && s.status === 'pending');
    const history = swaps.filter(s => s.status !== 'pending').sort((a, b) => b.id - a.id);

    return (
        <div className="text-white">
            <h1 className="mb-4 display-4">Swap Dashboard</h1>
            <section><h2 className="h4 border-bottom border-secondary pb-2 mb-3">Incoming Requests</h2>{incoming.length > 0 ? incoming.map(renderSwapCard) : <p className="text-white-50 fst-italic">No new incoming requests.</p>}</section>
            <section className="mt-5"><h2 className="h4 border-bottom border-secondary pb-2 mb-3">My Sent Requests</h2>{outgoing.length > 0 ? outgoing.map(renderSwapCard) : <p className="text-white-50 fst-italic">No pending outgoing requests.</p>}</section>
            <section className="mt-5"><h2 className="h4 border-bottom border-secondary pb-2 mb-3">History</h2>{history.length > 0 ? history.map(renderSwapCard) : <p className="text-white-50 fst-italic">No completed or rejected swaps.</p>}</section>
        </div>
    );
}

export default SwapDashboardPage;