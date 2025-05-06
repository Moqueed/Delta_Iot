const express = require("express");
const Router = express.Router();
const ActiveList = require("../models/ActiveList");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");

// ✅ Admin approves/rejects
Router.put("/review-status/:email", async (req, res) => {
    try {
      const { approval_status } = req.body;
      const approvalRequest = await Approval.findOne({ where: { candidate_email_id: req.params.email, approval_status: "Pending" } });
  
      if (!approvalRequest) return res.status(404).json({ error: "No pending review found" });
  
      if (approval_status === "Approved") {
        await Candidate.update({ progress_status: approvalRequest.requested_progress_status }, { where: { candidate_email_id: req.params.email } });
        await ActiveList.update({ progress_status: approvalRequest.requested_progress_status }, { where: { candidate_email_id: req.params.email } });
      } else if (approval_status === "Rejected") {
        await Rejected.create({ ...approvalRequest.dataValues });
        await ActiveList.destroy({ where: { candidate_email_id: req.params.email } });
      }
  
      await approvalRequest.update({ approval_status });

      res.status(200).json({ message: `Candidate ${approval_status}` });
    } catch (error) {
      console.error("❌ Error reviewing candidate:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });