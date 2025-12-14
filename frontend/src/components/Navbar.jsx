import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                <span style={{ color: 'white' }}>FitPlan</span><span style={{ color: 'var(--primary-color)' }}>HUB</span>
            </Link>
            <div className="nav-links">
                {user ? (
                    <>
                        <span className="text-muted" style={{ marginRight: '0.5rem', fontSize: '0.9rem' }}>{user.fullName}</span>
                        <Link to="/my-plans">My Plans</Link>
                        <Link to="/feed">Feed</Link>
                        {user.role === 'ROLE_TRAINER' && (
                            <Link to="/trainer-dashboard">Dashboard</Link>
                        )}
                        <button onClick={handleLogout} style={{ marginLeft: '1rem', padding: '5px 15px', fontSize: '0.9rem' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup" className="btn-secondary" style={{ marginLeft: '10px' }}>Signup</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
