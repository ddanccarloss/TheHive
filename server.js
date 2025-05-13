const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cronJob = require('./cronJob'); // Import the cron job
const loginRoute = require('./loginRoute'); // Import the login API
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection (replace with your connection string)
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/accessControl', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Serve static files (HTML, CSS, JS, etc.) from the current directory
app.use(express.static(__dirname));

// API Routes
app.use('/api', loginRoute);

// Route for the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Cron Job for regenerating access codes
cronJob;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});