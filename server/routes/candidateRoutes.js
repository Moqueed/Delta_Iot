// routes/candidateRoutes.js
const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const Rejected = require("../models/Rejected");
const { NewlyJoined } = require("../models/TotalData");

// ✅ Add new candidate and conditionally sync to ActiveList
router.post("/add-candidate", async (req, res) => {
  try {
    let {
      HR_name,
      HR_mail,
      candidate_name,
      candidate_email_id,
      contact_number,
      current_company,
      current_location,
      permanent_location,
      qualification,
      experience,
      skills,
      current_ctc,
      expected_ctc,
      band,
      reference,
      position,
      department,
      progress_status,
      status_date,
      entry_date,
      attachments,
      profile_stage,
      notice_period,
      comments,
    } = req.body;

    if (typeof skills === "string") {
      skills = skills.split(",").map((skill) => skill.trim());
    }

    if (
      !candidate_email_id ||
      !candidate_name ||
      !contact_number ||
      !HR_name ||
      !HR_mail ||
      !progress_status
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const candidate = await Candidate.create({
      HR_name,
      HR_mail,
      candidate_name,
      candidate_email_id,
      contact_number,
      current_company,
      current_location,
      permanent_location,
      qualification,
      experience,
      skills,
      current_ctc,
      expected_ctc,
      band,
      reference,
      position,
      department,
      progress_status,
      status_date,
      entry_date,
      attachments,
      profile_stage,
      notice_period,
      comments,
    });

    if (!candidate || !candidate.id) {
      return res.status(500).json({ error: "Candidate creation failed" });
    }

    const exists = await ActiveList.findOne({
      where: { candidate_email_id: candidate_email_id },
    });

    if (!exists) {
      await ActiveList.create({
        candidate_id: candidate.id,
        candidate_name,
        candidate_email_id,
        contact_number,
        HR_name,
        HR_mail,
        current_company,
        current_location,
        permanent_location,
        qualification,
        reference,
        skills,
        position,
        department,
        progress_status,
        comments,
        attachments,
        profile_stage,
        status_date,
        entry_date,
      });
    }

    res.status(201).json({
      message: "Candidate added successfully",
      candidate,
    });
  } catch (error) {
    console.error("❌ Error adding candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Search candidate by email for duplicate prevention
router.get("/search/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const foundInActive = await ActiveList.findOne({
      where: { candidate_email_id: email },
    });
    const foundInRejected = await Rejected.findOne({
      where: { candidate_email_id: email },
    });
    const foundInNewlyJoined = await NewlyJoined.findOne({
      where: { candidate_email_id: email },
    });

    if (foundInRejected)
      return res.status(200).json({ message: "Candidate is in Rejected list" });
    if (foundInNewlyJoined)
      return res.status(200).json({ message: "Candidate is already joined" });
    if (foundInActive)
      return res
        .status(200)
        .json({ message: "Candidate is already in Active List" });

    res.status(200).json({ message: "Candidate not found, you can proceed" });
  } catch (error) {
    console.error("❌ Error searching candidate:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all candidates
router.get("/fetch", async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.json(candidates);
  } catch (error) {
    console.error("❌ Error fetching candidates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
