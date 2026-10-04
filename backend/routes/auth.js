// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../server');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password, user_type, department } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password_hash, user_type, department) VALUES (?, ?, ?, ?, ?)',
            [name, email, password_hash, user_type, department]
        );
        const payload = { user: { id: result.insertId, user_type: user_type } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password, user_type } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND user_type = ?', [email, user_type]);
        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id, user_type: user.user_type } };
        jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;