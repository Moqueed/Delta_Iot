const { Op } = require("sequelize");
const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const Approvals = require("../models/Approval");
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");

const router = express.Router();

// ✅ Resume Upload Route
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

    // Sync with ActiveList & Approvals
    await ActiveList.update({ attachments: filePath }, { where: { candidate_email_id: email } });
    await Approvals.update({ attachments: filePath }, { where: { candidate_email_id: email } });

    res.json({ 
      message: "Resume uploaded and synced successfully", 
      candidateResume: candidate.attachments
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Assign Candidate to HR Route
router.post("/assign", async (req, res) => {
  try {
    const { hr_identifier, candidate_identifier, comments } = req.body;

    // Search HR by email or contact number
    const hr = await HR.findOne({ 
      where: { 
        [Op.or]: [{ email: hr_identifier }, { contact_number: hr_identifier }] 
      } 
    });
    if (!hr) return res.status(404).json({ message: "HR not found" });

    // Search Candidate by name or contact number
    const candidate = await Candidate.findOne({ 
      where: { 
        [Op.or]: [{ candidate_name: candidate_identifier }, { contact_number: candidate_identifier }] 
      } 
    });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // Assign Candidate to HR
    const assignment = await AssignToHR.create({
      hr_id: hr.id,
      candidate_id: candidate.id,
      comments,
      attachments: candidate.attachments
    });

    res.status(201).json({ message: "Candidate assigned to HR successfully!", assignment });
  } catch (error) {
    console.error("Error assigning candidate to HR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch Assigned Candidates with HR & Candidate Info
router.get("/assignments", async (req, res) => {
  try {
    const assignments = await AssignToHR.findAll({
      include: [
        { model: HR, attributes: ["name"] },
        { model: Candidate, attributes: ["candidate_email_id", "candidate_name", "position", "contact_number"] }
      ],
      attributes: ["comments", "attachments"]
    });

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
