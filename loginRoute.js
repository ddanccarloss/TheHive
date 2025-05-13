const express = require('express');
const crypto = require('crypto'); // For generating random codes
const pool = require('./memberSchema'); // PostgreSQL connection
const router = express.Router();
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(403).send('Unauthorized');
    }
};

// List all access codes
router.get('/api/access-codes/list', async (req, res) => {
    try {
        // Query the database to fetch all access codes
        const { rows } = await pool.query('SELECT * FROM access_codes');
        
        // Send the access codes as a JSON response
        res.json(rows);
    } catch (err) {
        // Handle errors
        console.error('Error listing access codes:', err);
        res.status(500).send('Internal server error');
    }
});

// Generate a new access code with expiration
router.post('/api/access-codes/generate', async (req, res) => {
    try {
        const newCode = Math.random().toString(36).substring(2, 10); // Generate a random 8-character code
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Add 24 hours to the current time

        const query = `
            INSERT INTO access_codes (code, expires_at) 
            VALUES ($1, $2) 
            RETURNING *`;
        const { rows } = await pool.query(query, [newCode, expiresAt]);

        res.status(201).json(rows[0]); // Return the newly created access code
    } catch (err) {
        console.error('Error generating access code:', err);
        res.status(500).send('Internal server error');
    }
});

// Validate an access code
router.post('/api/access-codes/validate', async (req, res) => {
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


