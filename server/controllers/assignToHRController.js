const Candidate = require("../models/Candidate");
const AssignToHR = require("../models/AssignToHR");
const HR = require("../models/HR");
const { sendAssignmentMail } = require("../utils/emailHelper");

//get the candidate
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignToHR.findAll({
      include: [
        {
          model: HR,
          attributes: ["id", "name", "email"],
        },
        {
          model: Candidate,
          attributes: ["id", "name", "email"],
        },
      ],
    });
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//assign a candidate to HR
const assignCandidateToHR = async (req, res) => {
  try {
    const {
      HR_mail,
      HR_name,
      candidate_name,
      candidate_email_id,
      position,
      contact_number,
      comments,
    } = req.body;

    if (
      !HR_mail ||
      !HR_name ||
      !candidate_name ||
      !candidate_email_id ||
      !position
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hr = await HR.findOne({ where: { email: HR_mail } });
    const candidate = await Candidate.findOne({
      where: { candidate_email_id },
    });

    if (!hr || !candidate) {
      return res.status(404).json({ error: "HR or Candidate not found" });
    }

    const resumeFile = req.file ? req.file.filename : null;

    const assignment = await AssignToHR.create({
      HR_id: HR.id,
      candidate_id: candidate.id,
      HR_mail,
      HR_name,
      candidate_name,
      candidate_email_id,
      position,
      contact_number,
      comments,
      attachments: resumeFile,
    });

    await sendAssignmentMail({
      HREmail: HR_mail,
      HRName: HR_name,
      candidateName: candidate_name,
      candidateEmail: candidate_email_id,
      position,
      contactNumber: contact_number,
      comments,
      resumePath: resumeFile,
    });

    res
      .status(201)
      .json({ message: "Candidate assigned and email sent to HR", assignment });
  } catch (error) {
    console.error("Error assigning candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//search a candidate to avoid duplicates
const searchCandidate = async (req, res) => {
  try {
    const { HR_email, HR_contact, candidate_name, candidate_contact } =
      req.query;

    const whereConditionHR = {};
    const whereConditionCandidate = {};

    // ✅ Filter HR by email or contact
    if (HR_email) whereConditionHR.email = HR_email;
    if (HR_contact) whereConditionHR.contact_number = HR_contact;

    // ✅ Filter Candidate by name or contact
    if (candidate_name) whereConditionCandidate.candidate_name = candidate_name;
    if (candidate_contact)
      whereConditionCandidate.contact_number = candidate_contact;

    const assignments = await AssignToHR.findAll({
      include: [
        {
          model: HR,
          attributes: ["id", "name", "email", "contact_number"],
          where: Object.keys(whereConditionHR).length
            ? whereConditionHR
            : undefined,
        },
        {
          model: Candidate,
          attributes: [
            "id",
            "candidate_name",
            "candidate_email_id",
            "position",
            "contact_number",
            "attachments",
          ],
          where: Object.keys(whereConditionCandidate).length
            ? whereConditionCandidate
            : undefined,
        },
      ],
      attributes: ["id", "comments", "attachments"],
    });

    res
      .status(200)
      .json({ message: "Filtered Assignments", data: assignments });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

module.exports = {
  assignCandidateToHR,
  getAllAssignments,
  searchCandidate,
};
