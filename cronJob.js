const pool = require('./memberSchema');

// Function to generate a new access code (can be reused in the cron job)
const generateAccessCode = async () => {
    try {
        const newCode = Math.random().toString(36).substring(2, 10);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const query = `
            INSERT INTO access_codes (code, expires_at) 
            VALUES ($1, $2)`;
        await pool.query(query, [newCode, expiresAt]);

        console.log('Generated new access code:', newCode);
    } catch (err) {
        console.error('Error generating access code in cron job:', err);
    }
};

// Function to delete expired access codes
const cleanupExpiredCodes = async () => {
    try {
        const query = `
            DELETE FROM access_codes 
            WHERE expires_at IS NOT NULL AND expires_at <= NOW()`;

        const { rowCount } = await pool.query(query);
        console.log(`Deleted ${rowCount} expired access codes.`);
    } catch (err) {
        console.error('Error cleaning up expired access codes:', err);
    }
};

// Run this function periodically (e.g., every hour)
const startCronJob = () => {
    setInterval(async () => {
        await generateAccessCode(); // Generate a new access code
        await cleanupExpiredCodes(); // Clean up expired access codes
    }, 60 * 60 * 1000); // Run every hour
};

// Export the cron job
module.exports = startCronJob;