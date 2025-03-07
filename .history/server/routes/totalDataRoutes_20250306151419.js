const express = require("express");
const router = express.Router();
const { Candidate, TotalData } = require("../models");

router.post("/create", async (req, res) => {
  try {
    const { candidate_id, status, count } = req.body;

    // Check if candidate exists in Candidates table
    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({
        message: `Candidate with ID ${candidate_id} not found. Please add the candidate first.`,
      });
    }

    // Check if TotalData entry already exists for this candidate
    const existingTotalData = await TotalData.findOne({ where: { candidate_id } });

    if (existingTotalData) {
      // If record exists, update instead of inserting
      await existingTotalData.update({ status, count });
      return res.status(200).json({ 
        message: `TotalData updated for candidate ${candidate_id}`,
        totalData: existingTotalData
      });
    }

    // Create new TotalData entry
    const newTotalData = await TotalData.create({ candidate_id, status, count });
    res.status(201).json({ message: "TotalData added successfully", totalData: newTotalData });

  } catch (error) {
    console.error("❌ Error creating/updating TotalData:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
