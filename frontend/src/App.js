import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import SeniorProfileEditor from './components/SeniorProfileEditor'; 
import SearchMentor from './components/SearchMentor'; 
import PrivateRoute from './components/PrivateRoute'; 
import './index.css';

function MainApp() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notification, setNotification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Checks local storage on mount to set initial login state
        if (localStorage.getItem('token')) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clears session and redirects to login
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setNotification({ msg: 'Logged out successfully.', type: 'success' });
        navigate('/');
        setTimeout(() => setNotification(null), 3000);
    };
    
    // Function to show notifications from child components
    const showNotification = (msg, type) => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Senior-Junior Interaction Portal</h1>
                {/* Logout button only rendered if logged in */}
                {isLoggedIn && (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                )}
            </header>
            
            {/* Notification bar display */}
            {notification && (
                <div className={`notification-bar ${notification.type} animated-slide-down`}>
                    {notification.msg}
                </div>
            )}
            
            <Routes>
                {/* Auth route passes the notification function and login setter */}
                <Route path="/" element={<Auth setIsLoggedIn={setIsLoggedIn} showNotification={showNotification} />} />

                {/* PROTECTED ROUTES: Using PrivateRoute component */}
                <Route 
                    path="/dashboard" 
                    element={<PrivateRoute><Dashboard showNotification={showNotification} /></PrivateRoute>} 
                />
                <Route 
                    path="/profile/senior/edit" 
                    element={<PrivateRoute><SeniorProfileEditor showNotification={showNotification} /></PrivateRoute>} 
                />
                <Route 
                    path="/search" 
                    element={<PrivateRoute><SearchMentor showNotification={showNotification} /></PrivateRoute>} 
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <MainApp />
        </Router>
    );
}

export default App;