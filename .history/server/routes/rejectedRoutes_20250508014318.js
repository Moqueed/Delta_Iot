const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");


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


//move 
const rejectedStatuses = ["rejected","declined offer", "no show", "withdrawn"]; // Add any other rejected statuses if necessary

router.put("/rejected-data/:id", async (req, res) => {
  const { id } = req.params;
  const {  rejected_by, rejected_by_role, rejection_reason } = req.body;  // Ensure status_reason is included in the body

  try {
    const activeRecord = await ActiveList.findByPk(id);

    if (!activeRecord) {
      return res.status(404).json({ message: "ActiveList record not found" });
    }

    if (rejectedStatuses.includes(progress_status.toLowerCase())) {
      // Update progress_status in ActiveList
      await ActiveList.update({ progress_status }, { where: { id } });

      // Check if candidate already exists in RejectedData
      const existingEntry = await Rejected.findOne({
        where: { candidate_email_id: activeRecord.candidate_email_id },
      });

      if (existingEntry) {
        await Rejected.update(
          { progress_status, status_reason },
          {
            where: { candidate_email_id: activeRecord.candidate_email_id },
          }
        );

        return res.status(200).json({
          message: "Progress status updated in both ActiveList and RejectedData",
        });
      }

      // Create new RejectedData entry
      await Rejected.create({
        candidate_email_id: activeRecord.candidate_email_id,
        candidate_name: activeRecord.candidate_name,
        position: activeRecord.position,
        department: activeRecord.department,
        rejection_reason, // ✅ Capture rejection reason
        rejected_by,
        rejected_by_role,
        status_date: new Date(),
      });

      return res.status(200).json({
        message: "Progress status updated and data moved to RejectedData",
      });
    }

    return res.status(200).json({
      message: "Progress status not eligible for RejectedData",
    });
  } catch (error) {
    console.error("❌ Error updating RejectedData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
