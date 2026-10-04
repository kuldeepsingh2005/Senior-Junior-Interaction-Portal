import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaUser, FaLock, FaEnvelope, FaBuilding, FaGoogle, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa';

const Auth = ({ setIsLoggedIn, showNotification }) => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        user_type: 'junior',
        department: ''
    });

    const { name, email, password, user_type, department } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();

        const endpoint = isLogin ? 'auth/login' : 'auth/register';
        const data = isLogin ? { email, password, user_type } : formData;

        try {
            const res = await api.post(endpoint, data); 
            localStorage.setItem('token', res.data.token);
            setIsLoggedIn(true);
            showNotification(`Welcome! Logged in as ${user_type}.`, 'success');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.msg || 'Connection failed. Try again.';
            showNotification(msg, 'error');
        }
    };

    const handleSwitch = (isLoginMode) => {
        setIsLogin(isLoginMode);
    };

    return (
        <div className="main-auth-wrapper">
            <div className="form-container">
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                <form onSubmit={onSubmit}>
                    {/* Registration-only fields */}
                    {!isLogin && (
                        <div className="input-group">
                            <FaUser className="input-icon" />
                            <input type="text" placeholder="Full Name" name="name" value={name} onChange={onChange} required />
                        </div>
                    )}
                    
                    {/* Common fields */}
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input type="email" placeholder="Email" name="email" value={email} onChange={onChange} required />
                    </div>
                    
                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                    </div>
                    
                    {/* Registration-only fields */}
                    {!isLogin && (
                        <>
                            <div className="input-group">
                                <FaBuilding className="input-icon" />
                                <input type="text" placeholder="Department (e.g., CSE)" name="department" value={department} onChange={onChange} required />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <select name="user_type" value={user_type} onChange={onChange}>
                            <option value="junior">Junior</option>
                            <option value="senior">Senior</option>
                        </select>
                    </div>

                    <button type="submit" className="login-button">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                
                {/* --- REGISTER/LOGIN SWITCH LINK --- */}
                <button 
                    type="button" 
                    className="register-link-button" 
                    onClick={() => handleSwitch(!isLogin)}
                >
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>

                <div className="social-container">
                    <p className="social-text">or login with social platforms</p>
                    <a href="#" className="social"><FaGoogle /></a>
                    <a href="#" className="social"><FaFacebook /></a>
                    <a href="#" className="social"><FaLinkedin /></a>
                    <a href="#" className="social"><FaGithub /></a>
                </div>
            </div>
        </div>
    );
};

export default Auth;