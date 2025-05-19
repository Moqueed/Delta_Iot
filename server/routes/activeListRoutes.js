const express = require("express");
const router = express.Router();
const ActiveList = require("../models/ActiveList");
const Approval = require("../models/Approval");
const Candidate = require("../models/Candidate");
const Rejected = require("../models/Rejected");
const nodemailer = require("nodemailer");
const { TotalMasterData, AboutToJoin, NewlyJoined, BufferData } = require("../models/TotalData");
const sequelize = require("../config/database");

// Mail setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// ✅ Change progress status directly
router.put("/change-status/:email", async (req, res) => {
  try {
    const { progress_status } = req.body;
    await Candidate.update(
      { progress_status },
      { where: { candidate_email_id: req.params.email } }
    );
    await ActiveList.update(
      { progress_status },
      { where: { candidate_email_id: req.params.email } }
    );

    res.status(200).json({ message: "Progress status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//add to activelist
router.post("/add-active-list", async (req, res) => {
  try {
    let {
      candidate_id,
      candidate_name,
      candidate_email_id,
      position,
      department,
      progress_status,
      entry_date,
      HR_name,
      HR_mail,
      comments,
      attachments,
      skills,
      contact_number,
      current_company,
    } = req.body;

    if (!candidate_id) {
      return res.status(400).json({ message: "candidate_id is required" });
    }

    if (typeof skills === "string") {
      skills = skills.split(",").map((s) => s.trim());
    }

    const formattedEntryDate = entry_date
      ? new Date(entry_date).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const newEntry = await ActiveList.create({
      candidate_id,
      candidate_name,
      candidate_email_id,
      position,
      department,
      progress_status,
      entry_date: formattedEntryDate,
      HR_name,
      HR_mail,
      comments,
      attachments,
      skills,
      contact_number,
      current_company,
    });

    res.status(201).json({ message: "Candidate added to Active List", data: newEntry });
  } catch (error) {
    console.error("Error inserting into Active List:", error);
    res.status(500).json({ message: "Failed to add candidate to Active List", error });
  }
});



//fetch all activelist candidates
router.get("/fetch", async(req, res) => {
  try{
    const candidates = await ActiveList.findAll();
    res.status(200).json(candidates);
  } catch(error){
    console.error(" Error Fetching active list:", error);
    res.status(500).json({error: "Failed to fetch active list"})
  }
});

//update active list
router.put("/update-active-list/:candidate_id", async (req, res) => {
  const { candidate_id } = req.params;
  const {
    HR_name = "",
    HR_mail = "",
    candidate_name = "",
    candidate_email_id = "",
    contact_number = "",
    current_company = "",
    current_location = "",
    permanent_location = "",
    qualification = "",
    reference = "",
    skills = [],
    position = "",
    department = "",
    progress_status = "",
    entry_date = null,
    comments = "",
    attachments = "",
    profile_stage = "open",
  } = req.body;

  try {
    const [existing] = await sequelize.query(
      "SELECT * FROM activelist WHERE candidate_id = ?",
      { replacements: [candidate_id] }
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Candidate not found in Active List" });
    }

    const formattedEntryDate = entry_date
      ? new Date(entry_date).toISOString().slice(0, 19).replace("T", " ")
      : null;

    const formattedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim())
      : [];

    await sequelize.query(
      `UPDATE activelist SET
        HR_name = ?, HR_mail = ?, candidate_name = ?, candidate_email_id = ?, contact_number = ?,
        current_company = ?, current_location = ?, permanent_location = ?, qualification = ?, reference = ?,
        skills = ?, position = ?, department = ?, progress_status = ?, entry_date = ?, comments = ?,
        attachments = ?, profile_stage = ?
      WHERE candidate_id = ?`,
      {
        replacements: [
          HR_name,
          HR_mail,
          candidate_name,
          candidate_email_id,
          contact_number,
          current_company,
          current_location,
          permanent_location,
          qualification,
          reference,
          JSON.stringify(formattedSkills),
          position,
          department,
          progress_status,
          formattedEntryDate,
          comments,
          attachments,
          profile_stage,
          candidate_id,
        ],
      }
    );

    res.status(200).json({ message: "Active List updated successfully" });
  } catch (err) {
    console.error("Error updating Active List:", err);
    res.status(500).json({ message: "Server error updating Active List" });
  }
});




// ✅ HR Request review for Admin
router.put("/request-review/:email", async (req, res) => {
  try {
    const { progress_status, requested_by } = req.body;
    const candidate = await Candidate.findOne({
      where: { candidate_email_id: req.params.email },
    });
    const activeListEntry = await ActiveList.findOne({
      where: { candidate_email_id: req.params.email },
    });

    if (!candidate || !activeListEntry)
      return res.status(404).json({ error: "Candidate not found" });

    await Approval.create({
      active_list_id: activeListEntry.id,
      candidate_email_id: candidate.candidate_email_id,
      candidate_name: candidate.candidate_name,
      HR_name: activeListEntry.HR_name,
      HR_mail: activeListEntry.HR_mail,
      contact_number: candidate.contact_number,
      position: candidate.position,
      department: candidate.department,
     progress_status: activeListEntry.progress_status,
      requested_by,
      approval_status: "Pending",
      entry_date: new Date(),
      status_date: new Date(),
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
router.post("/notify-manager", async (req, res) => {
  try {
    const { candidate_id, progress_status } = req.body;

    if (progress_status !== "Yet to share") {
      return res.status(400).json({ message: "Invalid progress status" });
    }

    const candidate = await Candidate.findByPk(candidate_id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
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

    res.status(200).json({ message: "Notification sent to manager" });
  } catch (error) {
    console.error("❌ Error notifying manager:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Allowed progress statuses for triggering data move
const totalMaster = [
  "application received",
  "phone screening",
  "l1 interview",
  "yet to share",
  "l2 interview",
  "shared with client",
];

// PUT /activelist/total-master-data/:id
router.put("/total-master-data/:id", async (req, res) => {
  const { id } = req.params;
  const { progress_status } = req.body;

  try {
    const activeRecord = await ActiveList.findByPk(id);

    if (!activeRecord) {
      return res.status(404).json({ message: "ActiveList record not found" });
    }

    // Update progress_status
    await ActiveList.update({ progress_status }, { where: { id } });

    const today = new Date();

    // Check if entry already exists in TotalMasterData
    const existingEntry = await TotalMasterData.findOne({
      where: {
        candidate_email_id: activeRecord.candidate_email_id,
      },
    });

    if (existingEntry) {
      await TotalMasterData.update(
        { progress_status },
        {
          where: {
            candidate_email_id: activeRecord.candidate_email_id,
          },
        }
      );

      return res.status(200).json({
        message: "Progress status updated in both ActiveList and About To Join",
      });
    }
    // If new status is in the allowed list, move to TotalMasterData
    if (totalMaster.includes(progress_status.toLowerCase())) {
      await TotalMasterData.create({
        candidate_id: activeRecord.candidate_id,
        candidate_name: activeRecord.candidate_name,
        candidate_email_id: activeRecord.candidate_email_id,
        position: activeRecord.position,
        department: activeRecord.department,
        progress_status: activeRecord.progress_status,
        status_date: today,
        entry_date: activeRecord.entry_date || today,
        HR_name: activeRecord.HR_name,
        HR_mail: activeRecord.HR_mail,
      });

      return res.status(200).json({
        message: "Progress status updated and data moved to Total Master Data",
      });
    } else {
      return res.status(200).json({
        message: "Progress status not eligible for Total Master Data",
      });
    }
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const aboutToJoin = ["offer released", "final discussion", "HR Round cleared"];

//About to join
router.put("/about-to-join/:id", async (req, res) => {
  const { id } = req.params;
  const { progress_status } = req.body;

  try {
    const activeRecord = await ActiveList.findByPk(id);

    if (!activeRecord) {
      return res.status(404).json({ message: "ActiveList record not found" });
    }

    // Update progress_status
    await ActiveList.update({ progress_status }, { where: { id } });

    const today = new Date();

    // Check if entry already exists in about_to_join
    const existingEntry = await AboutToJoin.findOne({
      where: {
        candidate_email_id: activeRecord.candidate_email_id,
      },
    });

    if (existingEntry) {
      await AboutToJoin.update(
        { progress_status },
        {
          where: {
            candidate_email_id: activeRecord.candidate_email_id,
          },
        }
      );

      return res.status(200).json({
        message: "Progress status updated in both ActiveList and About To Join",
      });
    }
    // If new status is in the allowed list, move to About ToJoin
    if (aboutToJoin.includes(progress_status.toLowerCase())) {
      await AboutToJoin.create({
        candidate_id: activeRecord.candidate_id,
        candidate_name: activeRecord.candidate_name,
        candidate_email_id: activeRecord.candidate_email_id,
        position: activeRecord.position,
        department: activeRecord.department,
        progress_status: activeRecord.progress_status,
        joining_date: today,
        HR_name: activeRecord.HR_name,
        HR_mail: activeRecord.HR_mail,
      });

      return res.status(200).json({
        message: "Progress status updated and data moved to About to Join",
      });
    } else {
      return res.status(200).json({
        message: "Progress status not eligible for About to Join",
      });
    }
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Newly Joined
const newlyJoined = ["joined"]; // Make sure it's lowercase

router.put("/newly-joined/:id", async (req, res) => {
  const { id } = req.params;
  const { progress_status } = req.body;

  try {
    const activeRecord = await ActiveList.findByPk(id);

    if (!activeRecord) {
      return res.status(404).json({ message: "ActiveList record not found" });
    }

    const today = new Date();

    // Only allow status in newlyJoined list
    if (newlyJoined.includes(progress_status.toLowerCase())) {
      // Update ActiveList
      await ActiveList.update({ progress_status }, { where: { id } });

      // Check if already exists in NewlyJoined
      const existingEntry = await NewlyJoined.findOne({
        where: {
          candidate_email_id: activeRecord.candidate_email_id,
        },
      });

      if (existingEntry) {
        await NewlyJoined.update(
          { progress_status },
          {
            where: {
              candidate_email_id: activeRecord.candidate_email_id,
            },
          }
        );

        return res.status(200).json({
          message: "Progress status updated in both ActiveList and NewlyJoined",
        });
      }

      // If not already in NewlyJoined, insert new
      await NewlyJoined.create({
        candidate_id: activeRecord.candidate_id,
        candidate_name: activeRecord.candidate_name,
        candidate_email_id: activeRecord.candidate_email_id,
        position: activeRecord.position,
        department: activeRecord.department,
        progress_status: progress_status, // use new status from request
        joining_date: today,
        HR_name: activeRecord.HR_name,
        HR_mail: activeRecord.HR_mail,
      });

      return res.status(200).json({
        message: "Progress status updated and data moved to NewlyJoined",
      });
    }

    return res.status(200).json({
      message: "Progress status not eligible for NewlyJoined",
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Buffer Data
const bufferStatuses = ["hold","buffer"]; // use lowercase

router.put("/buffer-data/:id", async (req, res) => {
  const { id } = req.params;
  const { progress_status, status_reason } = req.body;

  try {
    const activeRecord = await ActiveList.findByPk(id);

    if (!activeRecord) {
      return res.status(404).json({ message: "ActiveList record not found" });
    }

    const today = new Date();

    // Only allow buffer-status candidates
    if (bufferStatuses.includes(progress_status.toLowerCase())) {
      // Update ActiveList
      await ActiveList.update({ progress_status }, { where: { id } });

      // Check if already in BufferData
      const existingEntry = await BufferData.findOne({
        where: {
          candidate_email_id: activeRecord.candidate_email_id,
        },
      });

      if (existingEntry) {
        await BufferData.update(
          { progress_status },
          {
            where: {
              candidate_email_id: activeRecord.candidate_email_id,
            },
          }
        );

        return res.status(200).json({
          message: "Progress status updated in both ActiveList and BufferData",
        });
      }

      // If not in BufferData, create new entry
      await BufferData.create({
        candidate_id: activeRecord.candidate_id,
        candidate_name: activeRecord.candidate_name,
        candidate_email_id: activeRecord.candidate_email_id,
        position: activeRecord.position,
        department: activeRecord.department,
        progress_status: progress_status,
        HR_name: activeRecord.HR_name,
        HR_mail: activeRecord.HR_mail,
        status_reason: status_reason,
      });

      return res.status(200).json({
        message: "Progress status updated and data moved to BufferData",
      });
    }

    return res.status(200).json({
      message: "Progress status not eligible for BufferData",
    });
  } catch (error) {
    console.error("❌ Error updating status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
