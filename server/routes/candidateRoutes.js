const express = require("express");
const Candidate = require("../models/Candidate");
const router = express.Router();

// Add a new candidate
router.post("/add", async (req, res) => {
  try {
    const newCandidate = await Candidate.create(req.body);
    res.status(201).json({ message: "Candidate added successfully!", candidate: newCandidate });
  } catch (error) {
    res.status(500).json({ message: "Error adding candidate", error: error.message });
  }
});

// Get all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error: error.message });
  }
});

// Update a candidate by ID
router.put("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByPk(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.update(req.body);
    res.status(200).json({ message: "Candidate updated successfully!", candidate });
  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error: error.message });
  }
});


module.exports = router;
