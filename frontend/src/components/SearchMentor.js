import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaUser, FaCode, FaBook, FaTimes, FaPaperPlane } from 'react-icons/fa';

const SearchMentor = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('Enter a name, skill, or department to find a mentor.');
    const [chatModal, setChatModal] = useState({ visible: false, mentorName: '' });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setMessage('Searching...');
        
        const token = localStorage.getItem('token');
        const config = { 
            headers: { 'x-auth-token': token },
            params: { query: query }
        };

        try {
            const res = await axios.get('http://localhost:5000/api/profile/search', config);
            setResults(res.data);
            setMessage(res.data.length > 0 ? `Found ${res.data.length} mentors.` : 'No mentors found matching your query.');
        } catch (err) {
            console.error('Search error:', err);
            setMessage('Error performing search. Please ensure you are logged in as a Junior.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const renderSkills = (skillsJson) => {
        if (!skillsJson) return 'None added';
        try {
            const parsed = JSON.parse(skillsJson);
            if (Array.isArray(parsed)) {
                return parsed.join(' | ');
            }
            return String(parsed);
        } catch {
            return String(skillsJson); 
        }
    }

    const openChat = (mentorName) => {
        setChatModal({ visible: true, mentorName });
    };

    // Placeholder function to handle sending a message (removes 'disabled' status from button)
    const handleSendMessage = () => {
        alert(`Message sent to ${chatModal.mentorName}! (Mock integration)`);
        setChatModal({ visible: false, mentorName: '' });
    };

    return (
        <>
            <div className="dashboard-container search-container">
                <h2>Find Your Senior Mentor</h2>
                
                <form onSubmit={handleSearch} className="search-form animated-slide-down">
                    <div className="search-input-group">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by Name, Dept, or Skill (e.g., Python, CSE)"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                        />
                        <button type="submit" className="login-button" disabled={loading} style={{ margin: 0, borderRadius: '5px', height: '100%', fontSize: '0.9em', textTransform: 'uppercase' }}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>

                <p className="search-message" style={{color: results.length > 0 ? '#2ecc71' : '#f39c12', marginTop: '15px'}}>{message}</p>

                <div className="search-results">
                    {results.map(mentor => (
                        <div key={mentor.id} className="mentor-card animated-fade-in">
                            <div className="mentor-header">
                                <FaUser className="user-icon" />
                                <h3>{mentor.name} (Senior)</h3>
                            </div>
                            <p><FaBook /> Dept: {mentor.department}</p>
                            <p><FaCode /> Skills: {renderSkills(mentor.skills)}</p>
                            <p className="mentor-bio">"{mentor.bio || 'No bio available'}"</p>
                            <button className="chat-button login-button" onClick={() => openChat(mentor.name)} style={{ padding: '8px 15px', marginTop: '15px', borderRadius: '5px', fontSize: '0.9em' }}>Start Chat</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHAT MODAL - WhatsApp-Style Mock Implementation */}
            {chatModal.visible && (
                <div 
                    className="modal-backdrop animated-fade-in" 
                    onClick={(e) => {
                        // FIX: Only close if the click target is the backdrop
                        if (e.target.classList.contains('modal-backdrop')) {
                            setChatModal({ visible: false, mentorName: '' });
                        }
                    }}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Chat with {chatModal.mentorName}</h3>
                            <FaTimes className="close-icon" onClick={() => setChatModal({ visible: false, mentorName: '' })} />
                        </div>

                        <div className="chat-messages">
                            <div className="mock-message">
                                **[System]:** This feature is ready for real-time integration (Socket.io). All messages are secure and logged.
                            </div>
                            <div className="mock-message">
                                **[System]:** Once integrated, your messages will appear here and be sent instantly to {chatModal.mentorName}.
                            </div>
                        </div>

                        <div className="chat-input-area">
                            <textarea 
                                placeholder="Type your message..." 
                                rows="1" 
                                className="profile-textarea" 
                                // REMOVED: disabled attribute is now gone
                            />
                            <button className="send-button" onClick={handleSendMessage}>
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchMentor;