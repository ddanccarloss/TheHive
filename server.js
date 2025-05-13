const express = require('express');
const path = require('path');
const accessCodeRoute = require('./loginRoute'); // Access code routes
const startCronJob = require('./cronJob'); // Cron job for generating/cleaning codes
const pool = require('./memberSchema'); // PostgreSQL connection

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files if needed (optional)
app.use(express.static(path.join(__dirname)));

// Route for the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure index.html exists in the same directory
});

// Middleware
app.use(express.json()); // Use built-in JSON parsing middleware

// Routes
app.use('/api/access-codes', accessCodeRoute);

// Function to create the "access_codes" table if it doesn't exist
const createAccessCodesTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS access_codes (
            id SERIAL PRIMARY KEY,
            code VARCHAR(255) UNIQUE NOT NULL,
            status VARCHAR(50) DEFAULT 'active', -- Possible values: active, revoked, expired
            created_at TIMESTAMP DEFAULT NOW(),
            expires_at TIMESTAMP -- Optional expiration date
        );
        `;
        await pool.query(query); // Use the `pool` object to query the database
        console.log('Table "access_codes" is ready.');
    } catch (err) {
        console.error('Error creating table "access_codes":', err);
    }
};

// Call this function when the server starts
createAccessCodesTable();

// Start Cron Job
startCronJob();

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});