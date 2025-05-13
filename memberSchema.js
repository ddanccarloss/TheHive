const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://thehivedb_user:AJbm3i7RIniGFYUCWNRsei3jPJxjSoYn@dpg-d0hfp93e5dus73b076u0-a/thehivedb', // Use your database connection string here
    ssl: {
        rejectUnauthorized: false, // Required for Render free-tier PostgreSQL
    },
});

module.exports = pool;