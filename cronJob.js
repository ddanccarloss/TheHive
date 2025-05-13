const pool = require('./memberSchema'); // PostgreSQL connection
const crypto = require('crypto'); // For generating random access codes

const generateAccessCodes = async () => {
    try {
        const newCode = crypto.randomBytes(4).toString('hex'); // Generate a 4-byte random code
        await pool.query('INSERT INTO access_codes (code) VALUES ($1)', [newCode]);
        console.log(`Generated new access code: ${newCode}`);
    } catch (err) {
        console.error('Error generating access code:', err);
    }
};

// Run the cron job (e.g., every hour)
setInterval(generateAccessCodes, 3600000); // 1 hour = 3600000 ms

module.exports = generateAccessCodes;