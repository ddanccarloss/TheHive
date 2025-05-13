const pool = require('./memberSchema');
const crypto = require('crypto');

// Function to generate and store a new access code
const generateAccessCode = async () => {
    try {
        const newCode = crypto.randomBytes(4).toString('hex');
        await pool.query('INSERT INTO access_codes (code) VALUES ($1)', [newCode]);
        console.log(`Generated new access code: ${newCode}`);
    } catch (err) {
        console.error('Error generating access code:', err);
    }
};

// Run this function periodically (e.g., every hour)
setInterval(generateAccessCode, 3600000); // 1 hour = 3600000 ms

module.exports = generateAccessCode;