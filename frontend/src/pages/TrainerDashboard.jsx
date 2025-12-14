import React, { useState, useEffect } from 'react';
import api from '../api';

const TrainerDashboard = () => {
    const [plans, setPlans] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlan, setNewPlan] = useState({ title: '', description: '', price: '', durationDays: '' });

    useEffect(() => {
        fetchMyPlans();
    }, []);

    const fetchMyPlans = () => api.get('/plans/my-plans').then(res => setPlans(res.data)).catch(console.error);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plans', newPlan);
            setNewPlan({ title: '', description: '', price: '', durationDays: '' });
            setIsCreating(false);
            fetchMyPlans();
        } catch (err) {
            alert('Failed to create plan');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            try {
                await api.delete(`/plans/${id}`);
                fetchMyPlans();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <div>
            <div className="flex justify-between align-center mb-4">
                <h1>Trainer Dashboard</h1>
                <button onClick={() => setIsCreating(!isCreating)}>{isCreating ? 'Cancel' : 'Create New Plan'}</button>
            </div>

            {isCreating && (
                <div className="card glass">
                    <h3>Create Plan</h3>
                    <form onSubmit={handleCreate}>
                        <input type="text" placeholder="Title" value={newPlan.title} onChange={e => setNewPlan({ ...newPlan, title: e.target.value })} required />
                        <textarea placeholder="Description" rows="4" value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })} required />
                        <div className="grid grid-2">
                            <input type="number" placeholder="Price (₹)" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} required />
                            <input type="number" placeholder="Duration (Days)" value={newPlan.durationDays} onChange={e => setNewPlan({ ...newPlan, durationDays: e.target.value })} required />
                        </div>
                        <button type="submit">Publish Plan</button>
                    </form>
                </div>
            )}

            <div className="grid grid-2">
                {plans.map(plan => (
                    <div key={plan.id} className="card glass">
                        <h3>{plan.title}</h3>
                        <p>{plan.description.substring(0, 100)}...</p>
                        <div className="flex justify-between align-center mt-4">
                            <span>₹{plan.price}</span>
                            <button className="btn-secondary" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={() => handleDelete(plan.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainerDashboard;
