const express = require("express");
const router = express.Router();
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const Candidate = require("../models/Candidate");

// ✅ Assign Candidate to HR (Manual Attachments)
router.post("/assign", async (req, res) => {
  try {
    const { hr_id, candidate_id, comments, attachments } = req.body; // Attachments manually provided

    // Check if HR exists
    const hr = await HR.findByPk(hr_id);
    if (!hr) return res.status(404).json({ message: "HR not found" });

    // Check if Candidate exists
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // Create assignment (without auto-syncing resume)
    const newAssignment = await AssignToHR.create({
      hr_id,
      candidate_id,
      attachments, // Attachments manually added
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

// ✅ Search Assignments (Filter by HR or Candidate Details)
router.get("/search", async (req, res) => {
  try {
    const { hr_email, hr_contact, candidate_name, candidate_contact } = req.query;

    const hrFilter = {};
    if (hr_email) hrFilter.email = hr_email;
    if (hr_contact) hrFilter.contact_number = hr_contact;

    const candidateFilter = {};
    if (candidate_name) candidateFilter.candidate_name = candidate_name;
    if (candidate_contact) candidateFilter.contact_number = candidate_contact;

    const assignments = await AssignToHR.findAll({
      include: [
        { model: HR, attributes: ["id", "name", "contact_number"], where: Object.keys(hrFilter).length ? hrFilter : undefined },
        { 
          model: Candidate, 
          attributes: ["id", "candidate_name", "candidate_email_id", "position", "contact_number"], 
          where: Object.keys(candidateFilter).length ? candidateFilter : undefined 
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
