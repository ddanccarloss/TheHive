require('dotenv').config();

// Use environment variables like this
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const dbURI = process.env.DB_URI;
const secretKey = process.env.SECRET_KEY;

module.exports = { emailUser, emailPassword, dbURI, secretKey };