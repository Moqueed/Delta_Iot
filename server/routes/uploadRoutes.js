const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const Approvals = require("../models/Approval");

const router = express.Router();

// Resume Upload Route
router.post("/upload/:email", upload.single("resume"), async (req, res) => {
  try {
    const { email } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Construct file path
    const filePath = `/uploads/${file.filename}`;

    // Find and update Candidate
    let candidate = await Candidate.findOne({ where: { candidate_email_id: email } });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.attachments = filePath;
    await candidate.save();

    // Sync to ActiveList
    let activeEntry = await ActiveList.findOne({ where: { candidate_email_id: email } });
    if (activeEntry) {
      activeEntry.attachments = filePath;
      await activeEntry.save();
    }

    // Sync to Approvals
    let approvalEntry = await Approvals.findOne({ where: { candidate_email_id: email } });
    if (approvalEntry) {
      approvalEntry.attachments = filePath;
      await approvalEntry.save();
    }

    res.json({ 
      message: "Resume uploaded and synced successfully", 
      candidateResume: candidate.attachments, 
      activeListResume: activeEntry ? activeEntry.attachments : "No active list entry found",
      approvalsResume: approvalEntry ? approvalEntry.attachments : "No approval entry found"
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
