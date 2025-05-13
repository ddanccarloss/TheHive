const express = require('express');
const Member = require('./memberSchema');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { accessCode } = req.body;

  try {
    const member = await Member.findOne({ accessCode });

    if (!member) {
      return res.status(401).json({ message: 'Invalid access code' });
    }

    if (new Date() > member.expiresAt) {
      return res.status(401).json({ message: 'Access code expired' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;