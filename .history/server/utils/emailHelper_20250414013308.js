const nodemailer = require('nodemailer');
const getPositionAssignedTemplate = require('./email_templates/positionAssignedTemplate');
const assignCandidateTemplate = require('./email_templates/assignCandidateTemplate');
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

const sendAssignmentMail = async (data) => {
  const { hrEmail, hrName, candidateName, candidateEmail, position, contactNumber, comments } = data;

  const htmlTemplate = assignCandidateTemplate({
    hrName,
    candidateName,
    candidateEmail,
    position,
    contactNumber,
    comments,
  });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: hrEmail,
    subject: `Candidate Assigned: ${candidateName}`,
    html: `
      <h3>Hello ${hrName},</h3>
      <p>A new candidate has been assigned to you:</p>
      <ul>
        <li><strong>Name:</strong> ${candidateName}</li>
        <li><strong>Email:</strong> ${candidateEmail}</li>
        <li><strong>Position:</strong> ${position}</li>
        <li><strong>Contact:</strong> ${contactNumber}</li>
        <li><strong>Comments:</strong> ${comments || "N/A"}</li>
      </ul>
      <p>Please review the details in your dashboard.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};


module.exports = {sendPositionMail, sendAssignmentMail};
