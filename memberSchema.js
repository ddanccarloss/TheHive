const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://thehivedb_user:AJbm3i7RIniGFYUCWNRsei3jPJxjSoYn@dpg-d0hfp93e5dus73b076u0-a/thehivedb', // Replace with your PostgreSQL connection string
    ssl: {
        rejectUnauthorized: false, // Required for Render free-tier databases
    },
});

module.exports = pool;