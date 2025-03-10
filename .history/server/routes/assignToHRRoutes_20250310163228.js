const express = require("express");
const router = express.Router();
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const Candidate = require("../models/Candidate");

// ✅ Assign Candidate to HR
router.post("/assign", async (req, res) => {
  try {
    const { hr_id, candidate_id, comments } = req.body;

    // Check if HR exists
    const hr = await HR.findByPk(hr_id);
    if (!hr) return res.status(404).json({ message: "HR not found" });

    // Check if Candidate exists
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // ✅ Auto-sync resume from Candidate model
    const resumePath = candidate.attachments;

    // Create new assignment
    const newAssignment = await AssignToHR.create({
      hr_id,
      candidate_id,
      attachments: resumePath,
      comments,
    });

    res.status(201).json({
      message: "Candidate assigned to HR successfully!",
      assignment: newAssignment,
    });

  } catch (error) {
    console.error("Error assigning candidate to HR:", error);
    res.status(500).json({ message: "Error assigning candidate to HR", error: error.message });
  }
});

// ✅ Search Assigned HR by Email or Contact
router.get("/search", async (req, res) => {
  try {
    const { hr_email, hr_contact, candidate_name, candidate_contact } = req.query;

    const whereCondition = {};
    if (hr_email) whereCondition.email = hr_email;
    if (hr_contact) whereCondition.contact_number = hr_contact;
    if (candidate_name) whereCondition["$Candidate.candidate_name$"] = candidate_name;
    if (candidate_contact) whereCondition["$Candidate.contact_number$"] = candidate_contact;

    const assignments = await AssignToHR.findAll({
      include: [
        { model: HR, attributes: ["id", "name", "email", "contact_number"], where: hr_email || hr_contact ? whereCondition : {} },
        { 
          model: Candidate, 
          attributes: ["id", "candidate_name", "candidate_email_id", "position", "contact_number", "attachments"], 
          where: candidate_name || candidate_contact ? whereCondition : {} 
        }
      ],
      attributes: ["id", "comments", "attachments"],
    });

    res.status(200).json({ message: "Filtered Assignments", data: assignments });

  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
});

module.exports = router;
