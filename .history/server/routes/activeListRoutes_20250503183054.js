const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");
const nodemailer = require("nodemailer");

// Mail setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: "your-email@gmail.com", pass: "your-password" },
});

// ✅ Change progress status directly
router.put("/change-status/:email", async (req, res) => {
  try {
    const { progress_status } = req.body;
    await Candidate.update({ progress_status }, { where: { candidate_email_id: req.params.email } });
    await ActiveList.update({ progress_status }, { where: { candidate_email_id: req.params.email } });

    res.status(200).json({ message: "Progress status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Request review for admin
router.put("/request-review/:email", async (req, res) => {
  try {
    const { progress_status, requested_by } = req.body;
    const candidate = await Candidate.findOne({ where: { candidate_email_id: req.params.email } });
    const activeListEntry = await ActiveList.findOne({ where: { candidate_email_id: req.params.email } });

    if (!candidate || !activeListEntry) return res.status(404).json({ error: "Candidate not found" });

    await Approval.create({
      active_list_id: activeListEntry.id,
      candidate_email_id: candidate.candidate_email_id,
      candidate_name: candidate.candidate_name,
      HR_name: activeListEntry.HR_name,
      HR_mail: activeListEntry.HR_mail,
      position: candidate.position,
      department: candidate.department,
      previous_progress_status: candidate.progress_status,
      requested_progress_status: progress_status,
      requested_by,
      approval_status: "Pending",
    });

    res.status(200).json({ message: "Review request sent to admin" });
  } catch (error) {
    console.error("❌ Error requesting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Admin approves/rejects
router.put("/review-status/:email", async (req, res) => {
  try {
    const { approval_status } = req.body;
    const approvalRequest = await Approval.findOne({ where: { candidate_email_id: req.params.email, approval_status: "Pending" } });

    if (!approvalRequest) return res.status(404).json({ error: "No pending review found" });

    if (approval_status === "Approved") {
      await Candidate.update({ progress_status: approvalRequest.requested_progress_status }, { where: { candidate_email_id: req.params.email } });
      await ActiveList.update({ progress_status: approvalRequest.requested_progress_status }, { where: { candidate_email_id: req.params.email } });
    } else if (approval_status === "Rejected") {
      await Rejected.create({ ...approvalRequest.dataValues });
      await ActiveList.destroy({ where: { candidate_email_id: req.params.email } });
    }

    await approvalRequest.update({ approval_status });

    // ✅ Send mail to HR
    const mailOptions = {
      from: "your-email@gmail.com",
      to: approvalRequest.HR_mail,
      subject: `Candidate Review Status - ${approvalRequest.candidate_name}`,
      text: `The candidate ${approvalRequest.candidate_name} has been ${approval_status}.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Candidate ${approval_status}` });
  } catch (error) {
    console.error("❌ Error reviewing candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const mailOptions = {
  from: "your-email@gmail.com",
  to: "manager-email@gmail.com",
  subject: `Candidate ${candidate_name} sent for Manager Consent`,
  text: `The candidate ${candidate_name} (Email: ${candidate_email_id} has progressed to "Yet to share")`
};

await transporter.sendMail(mailOptions);

module.exports = router;
