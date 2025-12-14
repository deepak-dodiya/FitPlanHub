import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserFeed = () => {
    const [allPlans, setAllPlans] = useState([]);
    const [following, setFollowing] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        api.get('/plans').then(res => setAllPlans(res.data)).catch(console.error);
        api.get('/social/following').then(res => setFollowing(res.data)).catch(console.error);
    }, [user, navigate]);

    const handleFollow = async (trainerId) => {
        try {
            await api.post(`/social/follow/${trainerId}`);
            setFollowing(prev => [...prev, trainerId]);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400) {
                setFollowing(prev => [...prev, trainerId]);
            }
        }
    };

    const handleUnfollow = async (trainerId) => {
        try {
            await api.post(`/social/unfollow/${trainerId}`);
            setFollowing(prev => prev.filter(id => id !== trainerId));
        } catch (err) { console.error(err); }
    };

    const PlanCard = ({ plan, showFollow = true }) => {
        const isFollowingTrainer = following.includes(plan.trainerId);
        const isMe = user && user.userId === plan.trainerId;

        return (
            <div className="card glass">
                <h3>{plan.title}</h3>
                <div className="flex justify-between align-center">
                    <p className="text-muted">by {plan.trainerName}</p>
                    {showFollow && !isMe && (
                        <button
                            className="btn-secondary"
                            style={{ padding: '2px 8px', fontSize: '0.8rem' }}
                            onClick={() => isFollowingTrainer ? handleUnfollow(plan.trainerId) : handleFollow(plan.trainerId)}
                        >
                            {isFollowingTrainer ? 'Unfollow' : 'Follow'}
                        </button>
                    )}
                </div>
                <div className="flex justify-between align-center mt-4">
                    <span style={{ fontSize: '1.2rem', color: 'var(--secondary-color)' }}>₹{plan.price}</span>
                    <Link to={`/plans/${plan.id}`} className="btn-secondary">View Details</Link>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="mt-4">
                <h1 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Your Feed</h1>
                <p className="text-muted mb-4">Plans from trainers you follow.</p>
                <div className="grid grid-2">
                    {allPlans.filter(p => following.includes(p.trainerId)).map(plan => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>
                {allPlans.filter(p => following.includes(p.trainerId)).length === 0 && (
                    <p className="text-muted">You are not following any trainers yet. Visit the <Link to="/">Home Page</Link> to find trainers.</p>
                )}
            </div>
        </div>
    );
};

export default UserFeed;
