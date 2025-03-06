const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");

// ✅ Get all candidates from ActiveList
router.get("/", async (req, res) => {
  try {
    const activeCandidates = await ActiveList.findAll();
    res.status(200).json(activeCandidates);
  } catch (error) {
    console.error("❌ Error fetching ActiveList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get a specific candidate by email from ActiveList
router.get("/:email", async (req, res) => {
  try {
    const candidate = await ActiveList.findOne({ where: { candidate_email_id: req.params.email } });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found in ActiveList" });
    }
    res.status(200).json(candidate);
  } catch (error) {
    console.error("❌ Error fetching candidate from ActiveList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete a candidate from ActiveList
router.delete("/:email", async (req, res) => {
  try {
    const deleted = await ActiveList.destroy({ where: { candidate_email_id: req.params.email } });
    if (!deleted) {
      return res.status(404).json({ error: "Candidate not found in ActiveList" });
    }
    res.status(200).json({ message: "Candidate removed from ActiveList" });
  } catch (error) {
    console.error("❌ Error deleting candidate from ActiveList:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
