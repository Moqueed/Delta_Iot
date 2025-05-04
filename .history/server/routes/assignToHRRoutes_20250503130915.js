const express = require("express");
const router = express.Router();
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const Candidate = require("../models/Candidate");
const { getAllAssignments, assignCandidateToHR } = require("../controllers/assignToHRController");

// ✅ Assign Candidate to HR
// router.post("/assigning", async (req, res) => {
//   try {
//     const { hr_id, candidate_id, comments } = req.body;

//     // Check if HR exists
//     const hr = await HR.findByPk(hr_id);
//     if (!hr) return res.status(404).json({ message: "HR not found" });

//     // Check if Candidate exists
//     const candidate = await Candidate.findByPk(candidate_id);
//     if (!candidate) return res.status(404).json({ message: "Candidate not found" });

//     // ✅ Auto-sync resume from Candidate model
//     const resumePath = candidate.attachments;

//     // Create new assignment
//     const newAssignment = await AssignToHR.create({
//       hr_id,
//       candidate_id,
//       attachments: resumePath,
//       comments,
//     });

//     res.status(201).json({
//       message: "Candidate assigned to HR successfully!",
//       assignment: newAssignment,
//     });

//   } catch (error) {
//     console.error("Error assigning candidate to HR:", error);
//     res.status(500).json({ message: "Error assigning candidate to HR", error: error.message });
//   }
// });

// ✅ Search Assigned HR by Email or Contact
router.get("/search", async (req, res) => {
  try {
    const { hr_email, hr_contact, candidate_name, candidate_contact } = req.query;

    const whereConditionHR = {};
    const whereConditionCandidate = {};

    // ✅ Filter HR by email or contact
    if (hr_email) whereConditionHR.email = hr_email;
    if (hr_contact) whereConditionHR.contact_number = hr_contact;

    // ✅ Filter Candidate by name or contact
    if (candidate_name) whereConditionCandidate.candidate_name = candidate_name;
    if (candidate_contact) whereConditionCandidate.contact_number = candidate_contact;

    const assignments = await AssignToHR.findAll({
      include: [
        { 
          model: HR, 
          attributes: ["id", "name", "email", "contact_number"], 
          where: Object.keys(whereConditionHR).length ? whereConditionHR : undefined 
        },
        { 
          model: Candidate, 
          attributes: ["id", "candidate_name", "candidate_email_id", "position", "contact_number", "attachments"], 
          where: Object.keys(whereConditionCandidate).length ? whereConditionCandidate : undefined 
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


router.get("/assignments", getAllAssignments);
router.post("/assign", assignCandidateToHR)


module.exports = router;
