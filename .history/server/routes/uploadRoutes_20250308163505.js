const { Op } = require("sequelize");
const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const Candidate = require("../models/Candidate");
const ActiveList = require("../models/ActiveList");
const Approvals = require("../models/Approval");

const router = express.Router();

// ✅ Resume Upload Route with Upsert Logic for ActiveList & Approvals
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

    // Upsert for ActiveList: update if exists, otherwise create new record using candidate data.
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

    // Upsert for Approvals: update if exists, otherwise create new record using candidate data.
    let approvalEntry = await Approvals.findOne({ where: { candidate_email_id: email } });
    if (approvalEntry) {
      approvalEntry.attachments = filePath;
      await approvalEntry.save();
    } else {
      approvalEntry = await Approvals.create({
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
        comments: candidate.comments,
        // If your Approval model requires additional fields (such as active_list_id, previous_progress_status,
        // requested_progress_status, requested_by), you need to supply those values as well.
        active_list_id: candidate.id, // Example: using candidate id (change as needed)
        previous_progress_status: candidate.progress_status, // Example: defaulting to candidate.progress_status
        requested_progress_status: candidate.progress_status,  // Change this according to your logic
        requested_by: "System" // Or use a logged-in user's identifier if available
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

module.exports = router;
