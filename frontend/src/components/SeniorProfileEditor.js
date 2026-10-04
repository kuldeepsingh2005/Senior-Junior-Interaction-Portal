import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SeniorProfileEditor = () => {
    const [formData, setFormData] = useState({
        skills: '',
        bio: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('Updating profile...');

        const token = localStorage.getItem('token');

        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

            const config = { headers: { 'x-auth-token': token } };

            const res = await axios.post(
                'http://localhost:5000/api/profile/senior',
                { skills: skillsArray, bio: formData.bio },
                config
            );

            setMessage(res.data.msg + " Redirecting...");
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (err) {
            console.error("Profile Update Error:", err);
            setMessage(err.response?.data?.msg || 'Error updating profile. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Update Senior Profile</h2>
            <p className="form-message" style={{ color: message.includes('Error') ? '#e74c3c' : '#2ecc71' }}>{message}</p>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Skills (Comma separated, e.g., Python, React, MySQL)</label>
                    <input
                        type="text"
                        placeholder="Python, Django, AWS"
                        name="skills"
                        value={formData.skills}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Bio/Experience Summary</label>
                    <textarea
                        placeholder="Briefly describe your experience and mentoring style."
                        name="bio"
                        value={formData.bio}
                        onChange={onChange}
                        rows="4"
                        required
                        className="profile-textarea"
                    ></textarea>
                </div>
                <button type="submit" className="login-button">Save Profile</button>
                <button type="button" onClick={() => navigate('/dashboard')} className="ghost" style={{ marginTop: '10px', marginLeft: '0' }}>
                    Back to Dashboard
                </button>
            </form>
        </div>
    );
};

export default SeniorProfileEditor;