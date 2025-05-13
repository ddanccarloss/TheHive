const cron = require('node-cron');
const Member = require('./memberSchema');
const generateAccessCode = require('./generateAccessCode');
const sendEmail = require('./sendEmail');

// Schedule the cron job to run every 24 hours
cron.schedule('0 0 * * *', async () => {
  try {
    const members = await Member.find();

    for (const member of members) {
      const newAccessCode = generateAccessCode();
      const newExpiration = new Date();
      newExpiration.setDate(newExpiration.getDate() + 1); // Set expiration to 24 hours

      // Update member record
      member.accessCode = newAccessCode;
      member.expiresAt = newExpiration;
      await member.save();

      // Send the new access code via email
      await sendEmail(member.email, 'Your New Access Code', `Your new access code is: ${newAccessCode}`);
    }

    console.log('Access codes regenerated and emails sent');
  } catch (error) {
    console.error('Error regenerating access codes:', error);
  }
});