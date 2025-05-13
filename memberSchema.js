const { Pool } = require('pg');

// Use connection string from Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://thehivedb_user:AJbm3i7RIniGFYUCWNRsei3jPJxjSoYn@dpg-d0hfp93e5dus73b076u0-a/thehivedb',
  ssl: { rejectUnauthorized: false } // Required for secure connections
});

// Example query to test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL:', res.rows);
  }
});

module.exports = pool;