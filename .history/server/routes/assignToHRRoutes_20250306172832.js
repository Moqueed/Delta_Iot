const express = require("express");
const router = express.Router();
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const Candidate = require("../models/Candidate");

// ✅ Assign Candidate to HR (Sync with Uploaded Resume)
router.post("/assign", async (req, res) => {
    try {
      const { hr_id, candidate_id, comments } = req.body;
  
      // Check if HR exists
      const hr = await HR.findByPk(hr_id);
      if (!hr) {
        return res.status(404).json({ message: "HR not found" });
      }
  
      // Check if Candidate exists
      const candidate = await Candidate.findByPk(candidate_id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
  
      // ✅ Get resume from Candidate model
      const resumePath = candidate.attachments; // Use resume field from Candidate model
  
      // ✅ Create assignment and sync resume
      const newAssignment = await AssignToHR.create({
        hr_id,
        candidate_id,
        attachments: resumePath, // Auto-sync resume
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

  // ✅ Get Assigned Candidates with HR & Candidate Info
router.get("/", async (req, res) => {
    try {
      const assignments = await AssignToHR.findAll({
        include: [
          { model: HR, attributes: ["name", "email", "contact_number"] },
          { model: Candidate, attributes: ["candidate_name", "email", "position", "contact_number", "resume"] }, // ✅ Fetch resume here
        ],
        attributes: ["comments", "attachments"],
      });
  
      res.status(200).json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ message: "Error fetching assignments", error: error.message });
    }
  });


module.exports = router;
