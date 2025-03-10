const { Op } = require("sequelize");
const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const Approvals = require("../models/Approval");
const HR = require("../models/HR");

const router = express.Router();

// ✅ Resume Upload Route with Upsert for ActiveList & Approvals
router.post("/upload/:email", upload.single("resume"), async (req, res) => {
  try {
    const { email } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${file.filename}`;

    // Update Candidate record
    let candidate = await Candidate.findOne({ where: { candidate_email_id: email } });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.attachments = filePath;
    await candidate.save();

    // Upsert for ActiveList: update if exists, else create a new record with full candidate data
    let activeEntry = await ActiveList.findOne({ where: { candidate_email_id: email } });
    if (activeEntry) {
      activeEntry.attachments = filePath;
      await activeEntry.save();
    } else {
      activeEntry = await ActiveList.create({
        candidate_email_id: candidate.candidate_email_id,
        attachments: filePath,
        HR_name: candidate.HR_name,
        HR_mail: candidate.HR_mail,
        entry_date: candidate.entry_date,
        candidate_name: candidate.candidate_name,
        position: candidate.position,
        department: candidate.department,
        skills: candidate.skills,
        progress_status: candidate.progress_status,
        profile_stage: candidate.profile_stage,
        status_date: candidate.status_date,
        contact_number: candidate.contact_number,
        current_company: candidate.current_company,
        current_location: candidate.current_location,
        permanent_location: candidate.permanent_location,
        qualification: candidate.qualification,
        experience: candidate.experience,
        current_ctc: candidate.current_ctc,
        expected_ctc: candidate.expected_ctc,
        band: candidate.band,
        reference: candidate.reference,
        notice_period: candidate.notice_period,
        comments: candidate.comments
      });
      console.log(`Created new ActiveList entry for ${email}`);
    }

    // Upsert for Approvals: update if exists, else create a new record using the ActiveList id
    let approvalEntry = await Approvals.findOne({ where: { candidate_email_id: email } });
    if (approvalEntry) {
      approvalEntry.attachments = filePath;
      await approvalEntry.save();
    } else {
      approvalEntry = await Approvals.create({
        candidate_email_id: candidate.candidate_email_id,
        attachments: filePath,
        active_list_id: activeEntry.id,  // Use the ActiveList record's id here
        HR_name: candidate.HR_name,
        HR_mail: candidate.HR_mail,
        entry_date: candidate.entry_date,
        candidate_name: candidate.candidate_name,
        position: candidate.position,
        department: candidate.department,
        skills: candidate.skills,
        previous_progress_status: candidate.progress_status, // You may adjust this logic as needed
        requested_progress_status: candidate.progress_status,  // Adjust as needed
        profile_stage: candidate.profile_stage,
        status_date: candidate.status_date,
        contact_number: candidate.contact_number,
        current_company: candidate.current_company,
        current_location: candidate.current_location,
        permanent_location: candidate.permanent_location,
        qualification: candidate.qualification,
        experience: candidate.experience,
        current_ctc: candidate.current_ctc,
        expected_ctc: candidate.expected_ctc,
        band: candidate.band,
        reference: candidate.reference,
        notice_period: candidate.notice_period,
        comments: candidate.comments,
        status: 'Pending',       // Default status (adjust if needed)
        requested_by: 'System'   // Default value (adjust if needed)
      });
      console.log(`Created new Approvals entry for ${email}`);
    }

    res.json({ 
      message: "Resume uploaded and synced successfully", 
      candidateResume: candidate.attachments,
      activeListResume: activeEntry.attachments,
      approvalsResume: approvalEntry.attachments
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Assign Candidate to HR Route
router.post("/assign", async (req, res) => {
  try {
    const { hr_identifier, candidate_identifier, comments } = req.body;

    // Search HR by email or contact number
    const hr = await HR.findOne({ 
      where: { 
        [Op.or]: [{ email: hr_identifier }, { contact_number: hr_identifier }] 
      } 
    });
    if (!hr) return res.status(404).json({ message: "HR not found" });

    // Search Candidate by name or contact number
    const candidate = await Candidate.findOne({ 
      where: { 
        [Op.or]: [{ candidate_name: candidate_identifier }, { contact_number: candidate_identifier }] 
      } 
    });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    // Assign Candidate to HR
    const assignment = await AssignToHR.create({
      hr_id: hr.id,
      candidate_id: candidate.id,
      comments,
      attachments: candidate.attachments
    });

    res.status(201).json({ message: "Candidate assigned to HR successfully!", assignment });
  } catch (error) {
    console.error("Error assigning candidate to HR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
