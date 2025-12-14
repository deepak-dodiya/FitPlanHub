import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TrainerDashboard from './pages/TrainerDashboard';
import UserFeed from './pages/UserFeed';
import MyPlans from './pages/MyPlans';
import PlanDetails from './pages/PlanDetails';

function App() {
    return (
        <div>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
                    <Route path="/feed" element={<UserFeed />} />
                    <Route path="/my-plans" element={<MyPlans />} />
                    <Route path="/plans/:id" element={<PlanDetails />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
