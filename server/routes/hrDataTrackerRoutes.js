const express = require("express");
const router = express.Router();
const HRDataTracker = require("../models/HRDataTracker");
const HR = require("../models/HR");
const Candidate = require("../models/Candidate");

// ✅ Add HR Data Tracker Entry
router.post("/add", async (req, res) => {
  try {
    const newEntry = await HRDataTracker.create(req.body);
    res.status(201).json({ message: "HR Data Tracker entry added successfully!", entry: newEntry });
  } catch (error) {
    res.status(500).json({ message: "Error adding HR Data Tracker entry", error: error.message });
  }
});

// ✅ Get HR Data Tracker with HR & Candidate Info
router.get("/fetch", async (req, res) => {
  try {
    const trackerData = await HRDataTracker.findAll({
      include: [
        { model: HR, attributes: ["name"] },
        { model: Candidate, attributes: ["candidate_name", "position", "status_date", "entry_date"] },
      ],
      attributes: ["status"]
    });

    res.status(200).json(trackerData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching HR Data Tracker", error: error.message });
  }
});

module.exports = router;
