const express = require("express");
const router = express.Router();
const TotalData = require("../models/TotalData");
const Candidate = require("../models/Candidate");

// ✅ Get Filtered Candidates by Status
router.get("/filter", async (req, res) => {
  try {
    const { status } = req.query;

    // ✅ Validate status
    const validStatuses = ["Master", "Joined", "About to Join", "Buffer", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    // ✅ Fetch filtered candidates
    const filteredCandidates = await TotalData.findAll({
      where: { status },
      include: [
        {
          model: Candidate,
          attributes: ["id", "candidate_name", "candidate_email_id", "position", "contact_number"],
        },
      ],
      attributes: ["candidate_id", "status", "count"],
    });

    res.status(200).json(filteredCandidates);
  } catch (error) {
    console.error("Error fetching filtered candidates:", error);
    res.status(500).json({ message: "Error fetching filtered candidates", error: error.message });
  }
});

Candidate.hasOne(TotalData, { foreignKey: "candidate_id" });
TotalData.belongsTo(Candidate, { foreignKey: "candidate_id" });

module.exports = router;
