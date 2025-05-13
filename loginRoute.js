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

module.exports = router;

