const express = require('express');
const pool = require('./memberSchema'); // Import the database pool
const router = express.Router();

// Middleware to handle authentication
router.get('/check-auth', (req, res) => {
    console.log('Session data:', req.session); // Debugging log
    if (req.session?.isAuthenticated) {
        res.status(200).json({ message: 'Authenticated' });
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Generate a new access code
router.post('/generate', async (req, res) => {
    try {
        const newCode = Math.random().toString(36).substring(2, 10); // Generate random code
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Set expiration to 24 hours from now

        const query = `
            INSERT INTO access_codes (code, expires_at) 
            VALUES ($1, $2) 
            RETURNING *`;
        const { rows } = await pool.query(query, [newCode, expiresAt]);

        // Set authentication in the session
        req.session.isAuthenticated = true;

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error generating access code:', err);
        res.status(500).send('Internal server error');
    }
});

// Validate an access code
router.post('/validate', async (req, res) => {
    const { code } = req.body;

    try {
        const query = `
            SELECT * 
            FROM access_codes 
            WHERE code = $1 AND (expires_at IS NULL OR expires_at > NOW())`;

        const { rows } = await pool.query(query, [code]);

        console.log('Access code validation result:', rows); // Debugging log

        if (rows.length === 0) {
            console.log('Invalid or expired access code:', code);
            return res.status(400).json({ message: 'Invalid or expired access code' });
        }

        // Set session state
        req.session.isAuthenticated = true;
        console.log('Session after setting isAuthenticated:', req.session); // Debugging log

        res.status(200).json({ message: 'Access code is valid', code: rows[0] });
    } catch (err) {
        console.error('Error validating access code:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
