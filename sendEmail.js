const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email provider
  auth: {
    user: 'seenzoneproductions@gmail.com', // Replace with your email
    pass: '!@#eWfqw23423', // Replace with your email password or app-specific password
  },
});

async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'seenzoneproductions@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
}

module.exports = sendEmail;