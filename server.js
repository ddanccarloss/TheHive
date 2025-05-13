const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cronJob = require('./cronJob'); // Import the cron job
const loginRoute = require('./loginRoute'); // Import the login API

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection (replace with your connection string)
mongoose
  .connect('mongodb://127.0.0.1:27017/accessControl', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api', loginRoute);

// Start Cron Job for regenerating access codes
cronJob;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});