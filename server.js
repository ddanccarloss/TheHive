const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const accessCodeRoute = require('./loginRoute'); // Access code routes
const generateAccessCodes = require('./cronJob'); // Cron job to generate codes

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files if needed (optional)
app.use(express.static(path.join(__dirname)));

// Route for the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ensure index.html exists in the same directory
});

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