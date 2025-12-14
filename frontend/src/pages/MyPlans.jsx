import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MyPlans = () => {
    const [purchasedPlans, setPurchasedPlans] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        api.get('/social/purchased').then(res => setPurchasedPlans(res.data)).catch(console.error);
    }, [user, navigate]);

    return (
        <div>
            <h1>My Plans</h1>
            <p className="text-muted mb-4">Your purchased fitness plans.</p>
            {purchasedPlans.length > 0 ? (
                <div className="grid grid-2">
                    {purchasedPlans.map(plan => (
                        <div key={plan.id} className="card glass">
                            <h3>{plan.title}</h3>
                            <p className="text-muted">by {plan.trainerName}</p>
                            <div className="flex justify-between align-center mt-4">
                                <Link to={`/plans/${plan.id}`} className="btn-secondary">View Details</Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted">You haven't purchased any plans yet.</p>
            )}
        </div>
    );
};

export default MyPlans;
