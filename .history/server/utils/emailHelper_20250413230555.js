const nodemailer = require('nodemailer');
const getPositionAssignedTemplate = require('./email_templates/positionAssignedTemplate');
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
    html: getPositionAssignedTemplate(positionTitle, positionDescription),
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendPositionMail;
