const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ActiveList = require("./ActiveList");

const Candidate = sequelize.define("Candidate", {
  HR_name: { type: DataTypes.STRING, allowNull: false },
  HR_mail: { type: DataTypes.STRING, allowNull: false },
  entry_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: {
    type: DataTypes.ENUM("Python Developer", "EMD Developer", "Intern", "Trainee", "C++ Developer", "Accounts", "Developer"),
    allowNull: false,
  },
  department: {
    type: DataTypes.ENUM("IT", "EMDB", "HIGH", "Financial", "Python"),
    allowNull: false,
  },
  skills: { type: DataTypes.TEXT },
  progress_status: {
    type: DataTypes.ENUM(
      "Application Received", "Phone Screening", "L1 Interview", "Yet to Share", "L2 Interview",
      "Shared with Client", "Final Discussion", "Offer Released", "Joined", "Declined Offer",
      "Rejected", "Withdrawn", "No Show", "Buffer", "Hold"
    ),
    allowNull: false,
  },
  profile_stage: { type: DataTypes.STRING },
  status_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  candidate_email_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  contact_number: { type: DataTypes.STRING, allowNull: false },
  current_company: { type: DataTypes.STRING },
  current_location: { type: DataTypes.STRING },
  permanent_location: { type: DataTypes.STRING },
  qualification: { type: DataTypes.STRING },
  experience: { type: DataTypes.INTEGER },
  current_ctc: { type: DataTypes.STRING },
  expected_ctc: { type: DataTypes.STRING },
  band: { type: DataTypes.ENUM("L0", "L1", "L2", "L3", "L4") },
  reference: { type: DataTypes.STRING },
  notice_period: { type: DataTypes.STRING },
  comments: { type: DataTypes.TEXT },
  attachments: { type: DataTypes.STRING },
},
{timestamps: false}
);

// Hook to auto-sync candidate to ActiveList
Candidate.afterCreate(async (candidate) => {
  try {
    await ActiveList.create({
      candidate_id: candidate.id,
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
      candidate_email_id: candidate.candidate_email_id,
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
      attachments: candidate.attachments,
    });

    console.log(`✅ Candidate added to ActiveList: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error adding candidate to ActiveList:", error);
  }
});

// Hook to remove candidate from ActiveList when deleted
Candidate.afterDestroy(async (candidate) => {
  try {
    await ActiveList.destroy({ where: { candidate_email_id: candidate.candidate_email_id } });
    console.log(`✅ Candidate removed from ActiveList: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error removing candidate from ActiveList:", error);
  }
});

module.exports = Candidate;
