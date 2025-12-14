import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const [plans, setPlans] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [following, setFollowing] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPlans();
        fetchTrainers();
        if (user) fetchFollowing();
    }, [user]);

    const fetchPlans = () => api.get('/plans').then(res => setPlans(res.data)).catch(console.error);
    const fetchTrainers = () => api.get('/public/trainers').then(res => setTrainers(res.data)).catch(console.error);
    const fetchFollowing = () => api.get('/social/following').then(res => setFollowing(res.data)).catch(console.error);

    const handleAction = (callback) => {
        if (!user) {
            navigate('/login');
        } else {
            callback();
        }
    };

    const handleFollow = async (trainerId) => {
        handleAction(async () => {
            try {
                await api.post(`/social/follow/${trainerId}`);
                setFollowing(prev => [...prev, trainerId]);
            } catch (err) {
                console.error(err);
                // If already following (400), ensure UI reflects it
                if (err.response && err.response.status === 400) {
                    setFollowing(prev => [...prev, trainerId]);
                }
            }
        });
    };

    const handleUnfollow = async (trainerId) => {
        handleAction(async () => {
            try {
                await api.post(`/social/unfollow/${trainerId}`);
                setFollowing(prev => prev.filter(id => id !== trainerId));
            } catch (err) { console.error(err); }
        });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h1 style={{ fontSize: '3rem', background: '-webkit-linear-gradient(45deg, #bb86fc, #03dac6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Transform Your Life
                </h1>
                <p className="text-muted">Find the perfect fitness plan from certified trainers.</p>
            </div>

            {/* Trainers Section */}
            <div className="mb-4">
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Our Expert Trainers</h2>
                <div className="grid grid-2">
                    {trainers.map(trainer => (
                        <div key={trainer.id} className="card glass flex justify-between align-center" style={{ cursor: 'pointer' }} onClick={() => !user && navigate('/login')}>
                            <div>
                                <h3 style={{ margin: 0 }}>{trainer.fullName}</h3>
                            </div>
                            {(!user || user.userId !== trainer.id) && (
                                <button
                                    className="btn-secondary"
                                    onClick={(e) => { e.stopPropagation(); following.includes(trainer.id) ? handleUnfollow(trainer.id) : handleFollow(trainer.id); }}
                                >
                                    {following.includes(trainer.id) ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {trainers.length === 0 && <p className="text-muted">Loading trainers...</p>}
            </div>

            {/* Plans Section */}
            <div>
                <h2 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Latest Plans</h2>
                <div className="grid grid-2">
                    {plans.map(plan => {
                        const isFollowingTrainer = following.includes(plan.trainerId);
                        const isMe = user && user.userId === plan.trainerId;

                        return (
                            <div key={plan.id} className="card glass">
                                <h3>{plan.title}</h3>
                                <div className="flex justify-between align-center">
                                    <p className="text-muted">by {plan.trainerName}</p>
                                    {!isMe && (
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
                    })}
                </div>
                {plans.length === 0 && <p className="text-center text-muted">No plans available yet. Be the first trainer to join!</p>}
            </div>
        </div>
    );
};

export default LandingPage;
