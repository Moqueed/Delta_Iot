// ✅ Mail route with Nodemailer setup and retry logic
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Notification = require("../models/Notification");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-password",
  },
});

const sendMail = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject,
      text: message,
    });
    await Notification.create({ recipient_email: email, subject, message, status: "Sent" });
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email failed:", error);
    await Notification.create({ recipient_email: email, subject, message, status: "Failed" });
  }
};

// 📩 Route to trigger email
router.post("/send-mail", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) return res.status(400).json({ error: "Missing email data" });

  try {
    await sendMail(email, subject, message);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

// 🔁 Retry failed emails
router.post("/retry-failed-mails", async (req, res) => {
  try {
    const failedNotifications = await Notification.findAll({ where: { status: "Failed" } });
    
    for (const notification of failedNotifications) {
      await sendMail(notification.recipient_email, notification.subject, notification.message);
    }

    res.status(200).json({ message: "Retry process completed" });
  } catch (error) {
    console.error("❌ Error retrying emails:", error);
    res.status(500).json({ error: "Retry failed" });
  }
});

module.exports = router;