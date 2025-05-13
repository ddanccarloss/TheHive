const crypto = require('crypto');

function generateAccessCode() {
  return crypto.randomBytes(8).toString('hex'); 
}

module.exports = generateAccessCode;