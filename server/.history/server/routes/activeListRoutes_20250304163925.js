const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");

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

// ✅ Request progress_status update (Requires Admin Approval)
router.put("/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, requestedBy } = req.body;

    const validStatuses = [
      "Application Received", "Phone Screening", "L1 Interview", "Yet to Share", "L2 Interview",
      "Shared with Client", "Final Discussion", "Offer Released", "Joined", "Declined Offer",
      "Rejected", "Withdrawn", "No Show", "Buffer", "Hold"
    ];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const activeEntry = await ActiveList.findByPk(id);
    if (!activeEntry) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Create an approval request before updating
    await Approval.create({
      active_list_id: id,
      HR_name: activeEntry.HR_name,
      HR_mail: activeEntry.HR_mail,
      entry_date: activeEntry.entry_date,
      candidate_name: activeEntry.candidate_name,
      position: activeEntry.position,
      department: activeEntry.department,
      skills: activeEntry.skills,
      previous_progress_status: activeEntry.progress_status,
      requested_progress_status: newStatus,
      profile_stage: activeEntry.profile_stage,
      status_date: activeEntry.status_date,
      candidate_email_id: activeEntry.candidate_email_id,
      contact_number: activeEntry.contact_number,
      current_company: activeEntry.current_company,
      current_location: activeEntry.current_location,
      permanent_location: activeEntry.permanent_location,
      qualification: activeEntry.qualification,
      experience: activeEntry.experience,
      current_ctc: activeEntry.current_ctc,
      expected_ctc: activeEntry.expected_ctc,
      band: activeEntry.band,
      reference: activeEntry.reference,
      notice_period: activeEntry.notice_period,
      comments: activeEntry.comments,
      attachments: activeEntry.attachments,
      status: "Pending",
      requested_by: requestedBy
    });

    res.status(200).json({ message: "Status change request sent for admin approval" });
  } catch (error) {
    console.error("❌ Error requesting status change:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// ✅ Admin Approves/Rejects Status Change
router.put("/approve-status/:approvalId", async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { decision, approvedBy } = req.body; // decision = "Approved" or "Rejected"

    const approvalRequest = await Approval.findByPk(approvalId);
    if (!approvalRequest) {
      return res.status(404).json({ message: "Approval request not found" });
    }

    if (decision === "Approved") {
      // Update the actual ActiveList progress_status
      await ActiveList.update(
        { progress_status: approvalRequest.requested_progress_status },
        { where: { id: approvalRequest.active_list_id } }
      );
    }

    await approvalRequest.update({ status: decision, approved_by: approvedBy });

    res.status(200).json({ message: `Status change ${decision.toLowerCase()}` });
  } catch (error) {
    console.error("❌ Error processing approval:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// ✅ Get All Pending/Approved/Rejected Approvals
router.get("/approvals", async (req, res) => {
  try {
    const approvals = await Approval.findAll({
      attributes: [
        "id", "HR_name", "HR_mail", "entry_date", "candidate_name", "position", "department",
        "skills", "previous_progress_status", "requested_progress_status", "status",
        "profile_stage", "status_date", "candidate_email_id", "contact_number",
        "current_company", "current_location", "permanent_location", "qualification",
        "experience", "current_ctc", "expected_ctc", "band", "reference", "notice_period",
        "comments", "attachments", "requested_by", "approved_by"
      ],
      order: [["status", "ASC"]] // Pending approvals first
    });

    res.status(200).json(approvals);
  } catch (error) {
    console.error("❌ Error fetching approvals:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
