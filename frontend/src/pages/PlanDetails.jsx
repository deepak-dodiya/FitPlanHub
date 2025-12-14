import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const PlanDetails = () => {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [following, setFollowing] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlan();
        if (user) fetchFollowing();
    }, [id, user]);

    const fetchPlan = () => api.get(`/plans/${id}`).then(res => setPlan(res.data)).catch(console.error);
    const fetchFollowing = () => api.get('/social/following').then(res => setFollowing(res.data)).catch(console.error);

    const handleSubscribe = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await api.post(`/plans/${id}/subscribe`);
            alert('Subscribed successfully!');
            fetchPlan(); // Refresh to see full details
        } catch (err) {
            alert('Subscription failed: ' + (err.response?.data || err.message));
        }
    };

    const handleToggleFollow = async () => {
        if (!user) return navigate('/login');
        const isFollowing = following.includes(plan.trainerId);

        try {
            if (isFollowing) {
                await api.post(`/social/unfollow/${plan.trainerId}`);
                setFollowing(prev => prev.filter(id => id !== plan.trainerId));
            } else {
                await api.post(`/social/follow/${plan.trainerId}`);
                setFollowing(prev => [...prev, plan.trainerId]);
            }
        } catch (err) {
            console.error(err);
            // Sync state on error (e.g. if 400 already followed)
            if (!isFollowing && err.response && err.response.status === 400) {
                setFollowing(prev => [...prev, plan.trainerId]);
            }
        }
    };

    if (!plan) return <div>Loading...</div>;

    const isFollowing = following.includes(plan.trainerId);

    return (
        <div className="card glass" style={{ maxWidth: '800px', margin: 'auto' }}>
            <div className="flex justify-between align-center">
                <h1>{plan.title}</h1>
                <span style={{ fontSize: '1.5rem', color: 'var(--secondary-color)' }}>₹{plan.price}</span>
            </div>

            <div className="flex align-center mb-4">
                <p className="text-muted" style={{ marginRight: '1rem' }}>Trainer: {plan.trainerName}</p>
                {user && user.userId !== plan.trainerId && (
                    <button
                        className="btn-secondary"
                        style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                        onClick={handleToggleFollow}
                    >
                        {isFollowing ? 'Unfollow Trainer' : 'Follow Trainer'}
                    </button>
                )}
            </div>

            <p className="text-muted">Duration: {plan.durationDays} Days</p>
            <div style={{ margin: '2rem 0', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <h3>Description</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{plan.description}</p>
            </div>

            <div className="text-center">
                <button
                    onClick={handleSubscribe}
                    disabled={user && (user.userId === plan.trainerId || plan.subscribed)}
                    style={{ opacity: (user && (user.userId === plan.trainerId || plan.subscribed)) ? 0.6 : 1 }}
                >
                    {user && user.userId === plan.trainerId ? 'You own this plan' : (plan.subscribed ? 'Subscribed' : 'Subscribe Now')}
                </button>
            </div>
        </div>
    );
};

export default PlanDetails;
