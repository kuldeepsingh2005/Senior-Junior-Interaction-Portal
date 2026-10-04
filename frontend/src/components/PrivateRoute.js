// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');

    // If authenticated, render the children (the protected page)
    if (isAuthenticated) {
        return children;
    }

    // Otherwise, redirect to the login page
    return <Navigate to="/" replace />;
};

export default PrivateRoute;