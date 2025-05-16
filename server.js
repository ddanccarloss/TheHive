const express = require('express');
const path = require('path');
const accessCodeRoute = require('./loginRoute'); // Access code routes
const startCronJob = require('./cronJob'); // Cron job for generating/cleaning codes
const pool = require('./memberSchema'); // PostgreSQL connection
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'chololangsakalam', // Ensure strong secret
    resave: false,              // Prevent unnecessary session saving
    saveUninitialized: true,    // Save sessions even if not modified
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Secure cookies in production
        httpOnly: true,         // Prevent JavaScript access to cookies
        maxAge: 24 * 60 * 60 * 1000 // Session cookie expires in 24 hours
    }
}));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Middleware
app.use(express.json()); // Use built-in JSON parsing middleware

// Routes
app.use('/api/access-codes', accessCodeRoute);

// Route for the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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
        await pool.query(query);
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
