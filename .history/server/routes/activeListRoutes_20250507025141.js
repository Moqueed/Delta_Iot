const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");
const nodemailer = require("nodemailer");
const { and } = require("sequelize");

// Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ✅ Change progress status directly
router.put("/change-status/:email", async (req, res) => {
  try {
    const { progress_status } = req.body;
    await Candidate.update({ progress_status }, { where: { candidate_email_id: req.params.email } });
    await ActiveList.update({ progress_status }, { where: { candidate_email_id: req.params.email } });

    res.status(200).json({ message: "Progress status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ HR Request review for Admin
router.put("/request-review/:email", async (req, res) => {
  try {
    const { progress_status, requested_by } = req.body;
    const candidate = await Candidate.findOne({ where: { candidate_email_id: req.params.email } });
    const activeListEntry = await ActiveList.findOne({ where: { candidate_email_id: req.params.email } });

    if (!candidate || !activeListEntry) return res.status(404).json({ error: "Candidate not found" });

    await Approval.create({
      active_list_id: activeListEntry.id,
      candidate_email_id: candidate.candidate_email_id,
      candidate_name: candidate.candidate_name,
      HR_name: activeListEntry.HR_name,
      HR_mail: activeListEntry.HR_mail,
      contact_number: candidate.contact_number,
      position: candidate.position,
      department: candidate.department,
      previous_progress_status: candidate.progress_status,
      requested_progress_status: progress_status,
      requested_by,
      approval_status: "Pending",
      entry_date: new Date(),
      status_date: new Date()
    });

    //✅ Notify Admin via mail
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ADMIN,
      subject: `Review Request for ${candidate.candidate_name}`,
      text: `Dear Admin,
      
      
      A review request has been by ${activeListEntry.HR_name} for the candidate:
      
      Name: ${candidate.candidate_name}
      Email: ${candidate.candidate_email_id}
      Position: ${candidate.position}
      Department: ${candidate.department}
      current Status: ${candidate.progress_status}
      Requested Status: ${progress_status}

        Please review and take necessary action on the dashboard.

        Regards,
        Recruitment Team`,
      };

      await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: "Review request sent to admin" });
  } catch (error) {
    console.error("❌ Error requesting review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Admin approves/rejects
// router.put("/review-status/:email", async (req, res) => {
//   try {
//     const { approval_status } = req.body;
//     const approvalRequest = await Approval.findOne({ where: { candidate_email_id: req.params.email, approval_status: "Pending" } });

//     if (!approvalRequest) return res.status(404).json({ error: "No pending review found" });

//     if (approval_status === "Approved") {
//       await Candidate.update({ progress_status: approvalRequest.requested_progress_status }, { where: { candidate_email_id: req.params.email } });
//       await ActiveList.update({ progress_status: approvalRequest.requested_progress_status }, { where: { candidate_email_id: req.params.email } });
//     } else if (approval_status === "Rejected") {
//       await Rejected.create({ ...approvalRequest.dataValues });
//       await ActiveList.destroy({ where: { candidate_email_id: req.params.email } });
//     }

//     await approvalRequest.update({ approval_status });

//     // ✅ Send mail to HR
//     const mailOptions = {
//       from: process.env.EMAIL_ADMIN,
//       to: approvalRequest.HR_mail,
//       subject: `Candidate Review Status - ${approvalRequest.candidate_name}`,
//       text: `The candidate ${approvalRequest.candidate_name} has been ${approval_status}.`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: `Candidate ${approval_status}` });
//   } catch (error) {
//     console.error("❌ Error reviewing candidate:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//HR mail to manager
router.post("/notify-manager", async(req, res) => {
  try{
    const{candidate_id, progress_status} = req.body;

    if(progress_status !== "Yet to share"){
      return res.status(400).json({message: "Invalid progress status"});
    }

    const candidate = await Candidate.findByPk(candidate_id);
    if(!candidate){
      return res.status(404).json({message: "Candidate not found"});
    }

    const managerEmail = process.env.EMAIL_MANAGER;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: managerEmail,
      subject: `Candidate "${candidate.candidate_name}" details`,
      text: `Hello Manager,
      
      A new candidate has been assigned, Kindly Review:
      
      Name: ${candidate.candidate_name}
      Email: ${candidate.candidate_email_id}
      Position: ${candidate.position}
      Contact: ${candidate.contact_number}
      
      Please Review the details.`,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({message: "Notification sent to manager"});
  }catch(error){
    console.error("❌ Error notifying manager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
