const express = require('express');
const bodyParser = require('body-parser');
const accessCodeRoute = require('./loginRoute'); // Access code routes
const generateAccessCodes = require('./cronJob'); // Cron job to generate codes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/access-codes', accessCodeRoute);

// Start Cron Job
generateAccessCodes;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});