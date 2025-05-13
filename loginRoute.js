const express = require('express');
const pool = require('./memberSchema'); // PostgreSQL connection
const router = express.Router();

// Validate an access code
router.get('/validate/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM access_codes WHERE code = $1 AND status = $2', [code, 'active']);
        if (rows.length === 0) {
            return res.status(404).send('Invalid or inactive access code');
        }
        res.send('Access code is valid');
    } catch (err) {
        console.error('Error validating access code:', err);
        res.status(500).send('Internal server error');
    }
});

// Revoke an access code
router.post('/revoke/:code', async (req, res) => {
    const { code } = req.params;
    try {
        const result = await pool.query('UPDATE access_codes SET status = $1 WHERE code = $2', ['revoked', code]);
        if (result.rowCount === 0) {
            return res.status(404).send('Access code not found');
        }
        res.send('Access code revoked');
    } catch (err) {
        console.error('Error revoking access code:', err);
        res.status(500).send('Internal server error');
    }
});

// List all active access codes
router.get('/list', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM access_codes WHERE status = $1', ['active']);
        res.json(rows);
    } catch (err) {
        console.error('Error listing access codes:', err);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;