import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '', fullName: '', role: 'user' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = formData.role === 'trainer' ? '/auth/signup/trainer' : '/auth/signup/user';
            await api.post(endpoint, formData);
            alert('Signup successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert('Signup failed');
        }
    };

    return (
        <div className="card glass" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2 className="text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                <input type="text" placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
                <input type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    <option value="user">User</option>
                    <option value="trainer">Trainer</option>
                </select>
                <button type="submit" style={{ width: '100%' }}>Sign Up</button>
            </form>
        </div>
    );
};

export default SignupPage;
