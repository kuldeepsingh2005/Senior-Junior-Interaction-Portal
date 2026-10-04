import axios from 'axios';

// Create a custom Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Interceptor: Runs before every request is sent
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;