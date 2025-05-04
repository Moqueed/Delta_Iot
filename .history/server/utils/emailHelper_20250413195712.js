const nodemailer = require('nodemailer');
require('dotenv').config();

const sendPositionMail = async (hrEmail, positionTitle, positionDescription) => {
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
};

module.exports = sendPositionMail;
