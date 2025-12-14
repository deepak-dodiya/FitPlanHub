import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { username, password });
            login(res.data.token, {
                userId: res.data.userId,
                role: res.data.role,
                fullName: res.data.fullName
            });
            navigate('/');
        } catch (err) {
            alert('Login failed');
        }
    };

    return (
        <div className="card glass options-container" style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" style={{ width: '100%' }}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
