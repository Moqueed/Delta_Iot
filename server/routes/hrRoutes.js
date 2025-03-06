const express = require("express");
const router = express.Router();
const HR = require("../models/HR");

// Add HR
router.post("/add", async (req, res) => {
  try {
    const newHR = await HR.create(req.body);
    res.status(201).json({ message: "HR added successfully!", hr: newHR });
  } catch (error) {
    res.status(500).json({ message: "Error adding HR", error: error.message });
  }
});

// Get all HRs
router.get("/", async (req, res) => {
  try {
    const hrList = await HR.findAll();
    res.status(200).json(hrList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching HR list", error: error.message });
  }
});

module.exports = router;
