const express = require("express");
const ActiveList = require("../models/ActiveList");
const { sequelize, Candidate } = require("../models");

const router = express.Router();

// ✅ Add a new candidate and sync with ActiveList (TotalData removed)
router.post("/add-candidate", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { candidate_email_id, progress_status, ...otherData } = req.body;

    if (!progress_status) {
      return res.status(400).json({ message: "progress_status is required" });
    }

    // 🔍 Check if candidate exists
    const existingCandidate = await Candidate.findOne({ where: { candidate_email_id } });
    if (existingCandidate) {
      return res.status(400).json({ message: "Candidate with this email already exists" });
    }

    // ✅ Insert into Candidate table
    const newCandidate = await Candidate.create(
      { candidate_email_id, progress_status, ...otherData },
      { transaction }
    );

    // ✅ Insert into ActiveList (Only ActiveList now!)
    await ActiveList.create(
      {
        candidate_id: newCandidate.id,
        candidate_email_id: newCandidate.candidate_email_id,
        ...otherData,
      },
      { transaction }
    );

    // ✅ Commit transaction
    await transaction.commit();
    res.status(201).json({
      message: "Candidate added successfully and synced to ActiveList!",
      candidate: newCandidate,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error adding candidate:", error);
    res.status(500).json({ message: "Error adding candidate", error: error.message });
  }
});

// ✅ Get all candidates
router.get("/get-candidates", async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    res.status(500).json({ message: "Error fetching candidates", error: error.message });
  }
});

// ✅ Update a candidate and sync with ActiveList (TotalData removed)
router.put("/update-candidate/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ✅ Update Candidate table
    await candidate.update(req.body);

    // ✅ Sync with ActiveList (Only ActiveList!)
    await ActiveList.update(req.body, { where: { candidate_email_id: candidate.candidate_email_id } });

    res.status(200).json({ message: "Candidate updated successfully!", candidate });
  } catch (error) {
    console.error("❌ Error updating candidate:", error);
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
});

// ✅ Delete a candidate from Candidate & ActiveList (TotalData removed)
router.delete("/delete-candidate/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // ✅ Delete from ActiveList
    await ActiveList.destroy({ where: { candidate_email_id: candidate.candidate_email_id } });

    // ✅ Delete from Candidate table
    await candidate.destroy();

    res.status(200).json({ message: "Candidate deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting candidate:", error);
    res.status(500).json({ message: "Error deleting candidate", error: error.message });
  }
});

module.exports = router;
