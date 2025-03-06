const express = require("express");
const router = express.Router();
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const Candidate = require("../models/Candidate");

// ✅ Assign Candidate to HR
router.post("/assign", async (req, res) => {
  try {
    const newAssignment = await AssignToHR.create(req.body);
    res.status(201).json({ message: "Candidate assigned to HR successfully!", assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: "Error assigning candidate to HR", error: error.message });
  }
});

// ✅ Get Assigned Candidates with HR & Candidate Info
router.get("/", async (req, res) => {
  try {
    const assignments = await AssignToHR.findAll({
      include: [
        { model: HR, attributes: ["name", "email", "contact_number"] },
        { model: Candidate, attributes: ["candidate_name", "email", "position", "contact_number", "resume"] },
      ],
      attributes: ["comments", "attachments"]
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error: error.message });
  }
});

module.exports = router;
