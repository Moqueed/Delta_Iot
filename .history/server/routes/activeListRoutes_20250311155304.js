const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");
const Candidate = require("../models/Candidate");

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

// ✅ Request progress status change (Adds to Approval table)
// router.put("/request-status-change/:email", async (req, res) => {
//   try {
//     const { progress_status } = req.body;
//     const candidate = await Candidate.findOne({ where: { candidate_email_id: req.params.email } });

//     if (!candidate) {
//       return res.status(404).json({ error: "Candidate not found" });
//     }

//     // Store request in Approval table for admin review
//     await Approval.create({
//       candidate_email_id: candidate.candidate_email_id,
//       previous_status: candidate.progress_status,
//       requested_status: progress_status,
//       approval_status: "Pending", // Default status before admin approves/rejects
//     });

//     res.status(200).json({ message: "Status change request sent for approval" });
//   } catch (error) {
//     console.error("❌ Error requesting status change:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.put("/request-status-change/:email", async (req, res) => {
  try {
    const { progress_status, requested_by } = req.body;

    // Find the candidate
    const candidate = await Candidate.findOne({ where: { candidate_email_id: req.params.email } });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Find the related active_list entry
    const activeListEntry = await ActiveList.findOne({ where: { candidate_email_id: req.params.email } });
    if (!activeListEntry) {
      return res.status(404).json({ error: "Candidate not found in Active List" });
    }

    // Store request in Approval table for admin review
    await Approval.create({
      active_list_id: activeListEntry.id, // ✅ Link to ActiveList
      candidate_email_id: candidate.candidate_email_id,
      candidate_name: candidate.candidate_name,
      HR_name: activeListEntry.HR_name, // Assuming HR details are stored in ActiveList
      HR_mail: activeListEntry.HR_mail,
      entry_date: activeListEntry.entry_date,
      position: candidate.position,
      department: candidate.department,
      previous_progress_status: candidate.progress_status,
      requested_progress_status: progress_status,
      status_date: new Date(),
      contact_number: candidate.contact_number,
      requested_by: requested_by, // From request body
      approval_status: "Pending", // Default status before admin approves/rejects
    });

    res.status(200).json({ message: "Status change request sent for approval" });
  } catch (error) {
    console.error("❌ Error requesting status change:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Admin approves/rejects progress status change
router.put("/approve-status-change/:email", async (req, res) => {
  try {
    const { approval_status } = req.body; // Expecting "Approved" or "Rejected"
    const approvalRequest = await Approval.findOne({
      where: { candidate_email_id: req.params.email, approval_status: "Pending" },
    });

    if (!approvalRequest) {
      return res.status(404).json({ error: "No pending approval request found" });
    }

    if (approval_status === "Approved") {
      // Update progress_status in Candidate table
      await Candidate.update(
        { progress_status: approvalRequest.requested_status },
        { where: { candidate_email_id: req.params.email } }
      );

      // Update ActiveList with the new progress_status
      await ActiveList.update(
        { progress_status: approvalRequest.requested_status },
        { where: { candidate_email_id: req.params.email } }
      );
    }

    // Update the approval request in Approval table
    await approvalRequest.update({ approval_status });

    res.status(200).json({ message: `Status change ${approval_status}` });
  } catch (error) {
    console.error("❌ Error approving status change:", error);
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

module.exports = router;
