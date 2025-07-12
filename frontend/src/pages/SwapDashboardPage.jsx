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

    const handleRespond = async (swapId, response) => {
        try {
            await api.put(`/swaps/${swapId}/respond?response=${response}`);
            window.location.reload(); 
        } catch {
            alert('Failed to respond to swap.');
        }
    };

    if (loading) return <p>Loading your swaps...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    const incomingRequests = swaps.filter(s => s.provider.id === currentUser.id && s.status === 'pending');
    const outgoingRequests = swaps.filter(s => s.requester.id === currentUser.id && s.status === 'pending');
    const history = swaps.filter(s => s.status === 'accepted' || s.status === 'rejected');

    const renderSwap = (swap, type) => (
        <div key={swap.id} className="card mb-3 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
                <div className="me-3">
                    {type === 'incoming' && (
                        <p className="mb-1">
                            <Link to={`/user/${swap.requester.id}`}>{swap.requester.name}</Link> wants your <strong>{swap.wanted_skill.name}</strong>
                            <br/>in exchange for their <strong>{swap.offered_skill.name}</strong>.
                        </p>
                    )}
                    {type === 'outgoing' && (
                         <p className="mb-1">
                            You requested <strong>{swap.wanted_skill.name}</strong> from <Link to={`/user/${swap.provider.id}`}>{swap.provider.name}</Link>
                            <br/>in exchange for your <strong>{swap.offered_skill.name}</strong>. Status: <span className="badge bg-warning text-dark">{swap.status}</span>
                        </p>
                    )}
                     {type === 'history' && (
                         <p className="mb-1">
                            Swap between you and <strong>{swap.requester.id === currentUser.id ? swap.provider.name : swap.requester.name}</strong>. 
                            Status: <span className={`badge ${swap.status === 'accepted' ? 'bg-success' : 'bg-secondary'}`}>{swap.status}</span>
                        </p>
                    )}
                </div>
                {type === 'incoming' && (
                    <div className="ms-auto">
                        <button className="btn btn-success me-2" onClick={() => handleRespond(swap.id, 'accepted')}>Accept</button>
                        <button className="btn btn-danger" onClick={() => handleRespond(swap.id, 'rejected')}>Reject</button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div>
            <h1>Swap Dashboard</h1>
            <hr />

            <section>
                <h2 className="h4">Incoming Requests</h2>
                {incomingRequests.length > 0 ? (
                    incomingRequests.map(swap => renderSwap(swap, 'incoming'))
                ) : <p className="text-muted">You have no new incoming requests.</p>}
            </section>

            <section className="mt-5">
                <h2 className="h4">My Sent Requests</h2>
                {outgoingRequests.length > 0 ? (
                    outgoingRequests.map(swap => renderSwap(swap, 'outgoing'))
                ) : <p className="text-muted">You have no pending outgoing requests.</p>}
            </section>

            <section className="mt-5">
                <h2 className="h4">History</h2>
                {history.length > 0 ? (
                    history.map(swap => renderSwap(swap, 'history'))
                ) : <p className="text-muted">You have no completed or rejected swaps.</p>}
            </section>
        </div>
    );
}

export default SwapDashboardPage;