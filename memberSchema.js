const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  accessCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Member', memberSchema);