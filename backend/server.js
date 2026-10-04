// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection Pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'newuser',
    password: '@Pranjal8526', // CRITICAL: Ensure this password is correct
    database: 'senior_junior_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the pool first
module.exports = pool;

// Import and use routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Simple test route
app.get('/', (req, res) => {
    res.send('Senior-Junior Portal Backend is live!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});