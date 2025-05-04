const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/send-position-mail', async (req, res) => {
  const { hrEmail, positionTitle, positionDescription } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: hrEmail,
      subject: `New Position Allotted: ${positionTitle}`,
      html: `
        <h3>Hello HR,</h3>
        <p>You have been assigned a new position:</p>
        <ul>
          <li><strong>Title:</strong> ${positionTitle}</li>
          <li><strong>Description:</strong> ${positionDescription}</li>
        </ul>
        <p>Please review it in your dashboard.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;
