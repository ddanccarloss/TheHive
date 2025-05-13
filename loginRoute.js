const express = require('express');
const pool = require('./memberSchema'); // Import the database pool
const router = express.Router();

// Middleware to handle authentication
router.get('/check-auth', (req, res) => {
    if (req.session?.isAuthenticated) { // Check if user is authenticated
        res.status(200).json({ message: 'Authenticated' });
    } else {
        res.status(401).json({ message: 'Unauthorized' }); // Redirect unauthenticated users
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

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired access code' });
        }

        res.status(200).json({ message: 'Access code is valid', code: rows[0] });
    } catch (err) {
        console.error('Error validating access code:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
