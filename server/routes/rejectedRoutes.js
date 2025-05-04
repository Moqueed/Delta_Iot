const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");


// ✅ Get all data from Rejected Data
router.get("/rejected", async (req, res) => {
  try {
    const data = await Rejected.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching Rejected Data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Admin or HR approves/rejects progress status change
router.put("/approve-status-change/:email", async (req, res) => {
  try {
    const { approval_status, rejected_by, rejected_by_role, rejection_reason } = req.body;
    const email = req.params.email;

    const approvalRequest = await Approval.findOne({
      where: { candidate_email_id: email, approval_status: "Pending" },
    });

    if (!approvalRequest) {
      return res.status(404).json({ error: "No pending approval request found" });
    }

    if (approval_status === "Approved") {
      // ✅ Update Candidate and ActiveList with the new progress_status
      await Candidate.update(
        { progress_status: approvalRequest.requested_progress_status },
        { where: { candidate_email_id: email } }
      );

      await ActiveList.update(
        { progress_status: approvalRequest.requested_progress_status },
        { where: { candidate_email_id: email } }
      );

      // ✅ Remove the approval request after success
      await approvalRequest.destroy();
      return res.status(200).json({ message: "Candidate status approved and updated" });
    }

    if (approval_status === "Rejected") {
      if (!rejected_by || !rejected_by_role || !rejection_reason) {
        return res.status(400).json({ error: "Rejected by, role, and reason are required" });
      }

      // ✅ Move the candidate to the Rejected table with a rejection reason
      await Rejected.create({
        candidate_email_id: approvalRequest.candidate_email_id,
        candidate_name: approvalRequest.candidate_name,
        position: approvalRequest.position,
        department: approvalRequest.department,
        rejection_reason, // ✅ Capture rejection reason
        rejected_by,
        rejected_by_role,
        status_date: new Date(),
      });

      // ✅ Remove the candidate from ActiveList and Approval tables
      await ActiveList.destroy({ where: { candidate_email_id: email } });
      await approvalRequest.destroy();

      return res.status(200).json({ message: "Candidate moved to Rejected list with reason" });
    }

    return res.status(400).json({ error: "Invalid approval status" });
  } catch (error) {
    console.error("❌ Error handling status change:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
