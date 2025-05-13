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

router.post('/generate', authenticate, async (req, res) => {
    try {
        const newCode = crypto.randomBytes(4).toString('hex');
        const result = await pool.query('INSERT INTO access_codes (code) VALUES ($1) RETURNING *', [newCode]);
        res.json({ message: 'Access code generated successfully', code: result.rows[0] });
    } catch (err) {
        console.error('Error generating access code:', err);
        res.status(500).send('Internal server error');
    }
});


router.get('/list', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM access_codes');
        res.json(rows); // Send the access codes as a JSON response
    } catch (err) {
        console.error('Error listing access codes:', err);
        res.status(500).send('Internal server error');
    }
});

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

// Generate a new access code
router.post('/api/access-codes/generate', async (req, res) => {
    try {
        const newCode = Math.random().toString(36).substring(2, 10); // Generate a random 8-character code
        const query = 'INSERT INTO access_codes (code) VALUES ($1) RETURNING *';
        const { rows } = await pool.query(query, [newCode]);
        res.status(201).json(rows[0]); // Return the newly created access code
    } catch (err) {
        console.error('Error generating access code:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;

