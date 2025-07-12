import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

function SwapDashboardPage() {
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchSwaps = async () => {
            if (!currentUser) return;
            try {
                const response = await api.get('/swaps/me');
                setSwaps(response.data);
            } catch (err) {
                setError('Failed to load swap requests.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSwaps();
    }, [currentUser]);

    // Handles the API call for accepting or rejecting a swap
    const handleRespond = async (swapId, response) => {
        if (!window.confirm(`Are you sure you want to ${response} this swap?`)) return;
        try {
            await api.put(`/swaps/${swapId}/respond?response=${response}`);
            window.location.reload();
        } catch  {
            alert('Failed to respond to swap.');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    
    if (error) return <div className="alert alert-danger">{error}</div>;

    const incomingRequests = swaps.filter(s => s.provider.id === currentUser.id && s.status === 'pending');
    const outgoingRequests = swaps.filter(s => s.requester.id === currentUser.id && s.status === 'pending');
    const history = swaps.filter(s => s.status === 'accepted' || s.status === 'rejected').sort((a, b) => b.id - a.id); 

    const renderSwapCard = (swap) => {
        const isRequester = swap.requester.id === currentUser.id;
        const otherUser = isRequester ? swap.provider : swap.requester;

        return (
            <div key={swap.id} className="card mb-3 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center flex-column flex-md-row">
                    <div className="me-3 mb-2 mb-md-0">
                        {isRequester ? (
                            <p className="mb-0">
                                You requested <strong>{swap.wanted_skill.name}</strong> from <Link to={`/user/${otherUser.id}`}>{otherUser.name}</Link>.
                            </p>
                        ) : (
                            <p className="mb-0">
                                <Link to={`/user/${otherUser.id}`}>{otherUser.name}</Link> requested your <strong>{swap.wanted_skill.name}</strong>.
                            </p>
                        )}
                        <small className="text-muted">
                            Offer: Your {isRequester ? swap.offered_skill.name : ''} for their {isRequester ? '' : swap.offered_skill.name}
                        </small>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className={`badge me-3 fs-6 ${
                            swap.status === 'accepted' ? 'bg-success' : 
                            swap.status === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                            {swap.status}
                        </span>
                        {!isRequester && swap.status === 'pending' && (
                            <div className="btn-group">
                                <button className="btn btn-sm btn-success" onClick={() => handleRespond(swap.id, 'accepted')}>Accept</button>
                                <button className="btn btn-sm btn-secondary" onClick={() => handleRespond(swap.id, 'rejected')}>Reject</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Swap Dashboard</h1>
            </div>

            <section>
                <h2 className="h4 border-bottom pb-2 mb-3">Incoming Requests</h2>
                {incomingRequests.length > 0 ? (
                    incomingRequests.map(renderSwapCard)
                ) : <p className="text-muted fst-italic">You have no new incoming requests.</p>}
            </section>

            <section className="mt-5">
                <h2 className="h4 border-bottom pb-2 mb-3">My Sent Requests</h2>
                {outgoingRequests.length > 0 ? (
                    outgoingRequests.map(renderSwapCard)
                ) : <p className="text-muted fst-italic">You have no pending outgoing requests.</p>}
            </section>

            <section className="mt-5">
                <h2 className="h4 border-bottom pb-2 mb-3">History</h2>
                {history.length > 0 ? (
                    history.map(renderSwapCard)
                ) : <p className="text-muted fst-italic">You have no completed or rejected swaps.</p>}
            </section>
        </div>
    );
}

export default SwapDashboardPage;