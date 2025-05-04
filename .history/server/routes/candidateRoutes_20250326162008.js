const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const TotalMasterData = require("../models/TotalData");
const AboutToJoin = require("../models/TotalData");
const NewlyJoined = require("../models/TotalData");
const BufferData = require("../models/TotalData");
const Rejected = require("../models/Rejected");

// ✅ Add new candidate and sync to ActiveList
router.post("/add", async (req, res) => {
  try {
    const newCandidate = await Candidate.create(req.body);

    // Auto-sync to ActiveList
    await ActiveList.create({
      candidate_id: newCandidate.id,
      candidate_name: newCandidate.candidate_name, 
      position: newCandidate.position,
      department: newCandidate.department,
      progress_status: newCandidate.progress_status || "Application Received",
      status_date: newCandidate.status_date || new Date(),
      entry_date: newCandidate.entry_date,
    });

    res.status(201).json({ message: "Candidate added and synced to Active List" });
  } catch (error) {
    console.error("❌ Error adding candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Search route to avoid duplicates
router.get("/search/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const foundInActive = await ActiveList.findOne({ where: { candidate_email_id: email } });
    const foundInRejected = await Rejected.findOne({ where: { candidate_email_id: email } });
    const foundInNewlyJoined = await NewlyJoined.findOne({ where: { candidate_email_id: email } });

    if (foundInRejected) {
      return res.status(200).json({ message: "Candidate is in Rejected list" });
    }
    if (foundInNewlyJoined) {
      return res.status(200).json({ message: "Candidate is already joined" });
    }
    if (foundInActive) {
      return res.status(200).json({ message: "Candidate is already in Active List" });
    }

    res.status(200).json({ message: "Candidate not found, you can proceed" });
  } catch (error) {
    console.error("❌ Error searching candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Move candidate to a different model
router.put("/move/:email", async (req, res) => {
  try {
    const { targetModel } = req.body;
    const email = req.params.email;

    const candidate = await ActiveList.findOne({ where: { candidate_email_id: email } });
    if (!candidate) return res.status(404).json({ error: "Candidate not found in Active List" });

    const models = {
      TotalMasterData,
      AboutToJoin,
      NewlyJoined,
      BufferData,
      Rejected,
    };

    if (!models[targetModel]) return res.status(400).json({ error: "Invalid target model" });

    // Move candidate to target model
    await models[targetModel].create({ ...candidate.dataValues });
    await ActiveList.destroy({ where: { candidate_email_id: email } });

    res.status(200).json({ message: `Candidate moved to ${targetModel}` });
  } catch (error) {
    console.error("❌ Error moving candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
