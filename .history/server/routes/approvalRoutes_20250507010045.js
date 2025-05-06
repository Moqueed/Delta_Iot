const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");
const Approval = require("../models/Approval");
const nodemailer = require("nodemailer");

// ✅ Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADMIN,
    pass: process.env.EMAIL_ADMIN_PASS,
  },
});

const sendMail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ADMIN,
      to,
      subject,
      text: message,
    });
    console.log(`📩 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
};

// ✅ Route with mail logic
router.put("/review-status/:email", async (req, res) => {
  try {
    const { approval_status } = req.body;

    const approvalRequest = await Approval.findOne({
      where: {
        candidate_email_id: req.params.email,
        approval_status: "Pending",
      },
    });

    if (!approvalRequest)
      return res.status(404).json({ error: "No pending review found" });

    if (approval_status === "Approved") {
      await Candidate.update(
        { progress_status: approvalRequest.requested_progress_status },
        { where: { candidate_email_id: req.params.email } }
      );
      await ActiveList.update(
        { progress_status: approvalRequest.requested_progress_status },
        { where: { candidate_email_id: req.params.email } }
      );

      // ✅ Send approval email
      await sendMail(
        approvalRequest.HR_mail,
        `Candidate Approved ✅ - ${approvalRequest.candidate_name}`,
        `Good news!\n\nThe candidate ${approvalRequest.candidate_name} has been approved.\n\nNew Status: ${approvalRequest.requested_progress_status}\n\nComments: ${approvalRequest.comments || "No additional comments."}`
      );

    } else if (approval_status === "Rejected") {
      await Rejected.create({ ...approvalRequest.dataValues });

      await ActiveList.destroy({
        where: { candidate_email_id: req.params.email },
      });

      // ❌ Send rejection email
      await sendMail(
        approvalRequest.HR_mail,
        `Candidate Rejected ❌ - ${approvalRequest.candidate_name}`,
        `Unfortunately, the candidate ${approvalRequest.candidate_name} has been rejected.\n\nComments: ${approvalRequest.comments || "No additional comments."}`
      );
    }

    await approvalRequest.update({ approval_status });

    res.status(200).json({ message: `Candidate ${approval_status}` });
  } catch (error) {
    console.error("❌ Error reviewing candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/approval", async (req, res) => {
  try {
    const newApproval = await Approval.create(req.body);
    res.status(201).json(newApproval);
  } catch (error) {
    console.error("Error creating approval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Edit approval request
router.put("/approval/:id", async (req, res) => {
  try {
    const approval = await Approval.findByPk(req.params.id);
    if (!approval) return res.status(404).json({ error: "Approval not found" });

    await approval.update(req.body);
    res.status(200).json({ message: "Approval updated successfully", approval });
  } catch (error) {
    console.error("Error updating approval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Save a new approval request (initial draft)
router.post("/approval/save", async (req, res) => {
  try {
    const {
      active_list_id, HR_name, HR_mail, entry_date, candidate_name, position,
      department, skills, previous_progress_status, requested_progress_status,
      profile_stage, status_date, candidate_email_id, contact_number, current_company,
      current_location, permanent_location, qualification, experience,
      current_ctc, expected_ctc, band, reference, notice_period, comments,
      attachments, requested_by
    } = req.body;

    const savedApproval = await Approval.create({
      active_list_id,
      HR_name,
      HR_mail,
      entry_date,
      candidate_name,
      position,
      department,
      skills,
      previous_progress_status,
      requested_progress_status,
      profile_stage,
      status_date,
      candidate_email_id,
      contact_number,
      current_company,
      current_location,
      permanent_location,
      qualification,
      experience,
      current_ctc,
      expected_ctc,
      band,
      reference,
      notice_period,
      comments,
      attachments,
      status: "Pending", // or "Draft" if you add it in ENUM
      approval_status: "Pending", // still waiting for admin
      requested_by,
    });

    res.status(201).json({ message: "Approval saved successfully", savedApproval });
  } catch (error) {
    console.error("Error saving approval:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel approval request (soft cancel)
router.put("/approval/cancel/:id", async (req, res) => {
  try {
    const approval = await Approval.findByPk(req.params.id);
    if (!approval || approval.approval_status !== "Pending") {
      return res.status(400).json({ error: "Only pending approvals can be canceled" });
    }

    await approval.update({ approval_status: "Cancelled" });

    res.status(200).json({ message: "Approval cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling approval:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
