// backend/routes/profile.js

const express = require('express');
const router = express.Router();
const pool = require('../server');
const auth = require('../middleware/auth');

// @route   GET /api/profile/me
router.get('/me', auth, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT name, email, user_type, department, skills, bio FROM users WHERE id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/profile/senior
router.post('/senior', auth, async (req, res) => {
    const { skills, bio } = req.body;
    const userId = req.user.id;

    if (req.user.user_type !== 'senior') {
        return res.status(403).json({ msg: 'Access denied. Only seniors can update this profile.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE users SET skills = ?, bio = ? WHERE id = ?',
            [JSON.stringify(skills), bio, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json({ msg: 'Senior profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/profile/search
router.get('/search', auth, async (req, res) => {
    const { query } = req.query; 
    
    if (req.user.user_type !== 'junior') {
        return res.status(403).json({ msg: 'Access denied. Only juniors can search mentors.' });
    }
    
    try {
        let sql = 'SELECT id, name, department, skills, bio FROM users WHERE user_type = "senior"';
        const params = [];

        if (query) {
            sql += ' AND (name LIKE ? OR department LIKE ? OR skills LIKE ?)';
            const searchTerm = `%${query}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        const [rows] = await pool.query(sql, params);
        res.json(rows);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;