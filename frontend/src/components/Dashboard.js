import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaEnvelopeOpenText, FaTimes } from 'react-icons/fa';

// Function to safely parse the skills data
const getSkills = (skillsData) => {
    if (!skillsData) return 'None added';
    
    if (typeof skillsData === 'object' && skillsData !== null && Array.isArray(skillsData)) {
        return skillsData.join(' | ');
    }
    try {
        const parsed = JSON.parse(skillsData);
        if (Array.isArray(parsed)) {
            return parsed.join(' | ');
        }
        return String(parsed);
    } catch (e) {
        return String(skillsData);
    }
};

const Dashboard = ({ showNotification }) => {
    const [userData, setUserData] = useState(null);
    const [inboxModal, setInboxModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/profile/me'); 
                setUserData(res.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                showNotification('Session expired or invalid token.', 'error');
                localStorage.removeItem('token');
                navigate('/'); 
            }
        };
        fetchUserData();
    }, [navigate, showNotification]);

    const renderUserSpecificContent = () => {
        if (!userData) return <p>Loading user data...</p>;
        
        return (
            <div className="dashboard-content">
                <h3 style={{ color: '#5b47b4' }}>{userData.user_type === 'senior' ? 'Mentor Dashboard' : 'Student Dashboard'}</h3>
                
                <p>Name: <strong>{userData.name}</strong></p>
                <p>Email: {userData.email}</p>
                <p>Department: {userData.department}</p>
                
                {/* Senior-specific content and actions */}
                {userData.user_type === 'senior' && (
                    <div className="senior-info">
                        <p>Skills: {getSkills(userData.skills)}</p>
                        <p>Bio: {userData.bio || 'None added'}</p>

                        <button onClick={() => setInboxModal(true)} className="messages-button">
                            <FaEnvelopeOpenText style={{marginRight: '8px'}} /> Check Messages (Mock Inbox)
                        </button>
                        <button onClick={() => navigate('/profile/senior/edit')} className="edit-button">
                            Update Profile Settings
                        </button>
                    </div>
                )}

                {/* Junior-specific content and actions */}
                {userData.user_type === 'junior' && (
                    <div className="junior-actions">
                        <p className="status-message">Ready to find a mentor?</p>
                        <button onClick={() => navigate('/search')} className="search-button">
                            Find a Senior Mentor
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="dashboard-container">
                {renderUserSpecificContent()}
            </div>

            {/* MOCK INBOX MODAL */}
            {inboxModal && (
                <div className="modal-backdrop animated-fade-in" onClick={(e) => {
                    if (e.target.classList.contains('modal-backdrop')) {
                        setInboxModal(false);
                    }
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Inbox: New Mentorship Requests</h3>
                            <FaTimes className="close-icon" onClick={() => setInboxModal(false)} />
                        </div>
                        <div className="chat-messages" style={{ backgroundColor: '#fff', textAlign: 'left' }}>
                            <div className="mock-message" style={{ backgroundColor: '#f0f0f0', color: 'var(--secondary-color)'}}>
                                **From Student XYZ:** "Hi, I saw your profile and need help with React. Are you available for a quick chat?"
                            </div>
                            <div className="mock-message" style={{ backgroundColor: '#f0f0f0', color: 'var(--secondary-color)'}}>
                                **From Student ABC:** "I'm interested in your Python skills. Can you share the roadmap?"
                            </div>
                            <p style={{marginTop: '40px', textAlign: 'center', color: '#5b47b4'}}>
                                *This is a mock inbox. Real-time integration is the next phase.*
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Dashboard;