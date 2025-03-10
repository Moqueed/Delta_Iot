const { Op } = require("sequelize");
const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const Approvals = require("../models/Approval");
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");

const router = express.Router();

// ✅ Resume Upload Route with Upsert Logic for ActiveList & Approvals
router.post("/upload/:email", upload.single("resume"), async (req, res) => {
  try {
    const { email } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${file.filename}`;

    // Update Candidate
    let candidate = await Candidate.findOne({ where: { candidate_email_id: email } });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.attachments = filePath;
    await candidate.save();

    // Upsert ActiveList entry: Update if exists, else create new record.
    let activeEntry = await ActiveList.findOne({ where: { candidate_email_id: email } });
    if (activeEntry) {
      activeEntry.attachments = filePath;
      await activeEntry.save();
    } else {
      activeEntry = await ActiveList.create({ candidate_email_id: email, attachments: filePath });
      console.log(`Created new ActiveList entry for ${email}`);
    }

    // Upsert Approvals entry: Update if exists, else create new record.
    let approvalEntry = await Approvals.findOne({ where: { candidate_email_id: email } });
    if (approvalEntry) {
      approvalEntry.attachments = filePath;
      await approvalEntry.save();
    } else {
      approvalEntry = await Approvals.create({ candidate_email_id: email, attachments: filePath });
      console.log(`Created new Approvals entry for ${email}`);
    }

    res.json({ 
      message: "Resume uploaded and synced successfully", 
      candidateResume: candidate.attachments,
      activeListResume: activeEntry.attachments,
      approvalsResume: approvalEntry.attachments
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
