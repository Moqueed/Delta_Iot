const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList"); // ✅ Correct model name
const Approvals = require("../models/Approvals"); // ✅ Check pluralization

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

    // ✅ Update Candidate
    let candidate = await Candidate.findOne({ where: { candidate_email_id: email } });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.attachments = filePath;
    await candidate.save();

    // ✅ Update ActiveLists if Exists
    let activeEntry = await ActiveList.findOne({ where: { candidate_email_id: email } }); // ✅ Changed to ActiveLists
    if (activeEntry) {
      activeEntry.attachments = filePath;
      await activeEntry.save();
    } else {
      console.log(`❌ No ActiveLists entry found for ${email}`);
    }

    // ✅ Update Approvals if Exists
    let approvalEntry = await Approvals.findOne({ where: { candidate_email_id: email } }); // ✅ Changed to Approvals
    if (approvalEntry) {
      approvalEntry.attachments = filePath;
      await approvalEntry.save();
    } else {
      console.log(`❌ No Approvals entry found for ${email}`);
    }

    res.json({ 
      message: "Resume uploaded and synced successfully", 
      candidateResume: candidate.attachments, 
      activeListResume: activeEntry ? activeEntry.attachments : "No ActiveLists entry found",
      approvalsResume: approvalEntry ? approvalEntry.attachments : "No Approvals entry found"
    });

  } catch (error) {
    console.error("❌ Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
