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
    allowNull: false 
  },
  department: { 
    type: DataTypes.ENUM("IT", "EMDB", "HIGH", "Financial", "Python"),
    allowNull: false
  },
  skills: { type: DataTypes.TEXT },
  progress_status: { 
    type: DataTypes.ENUM(
      "Application Received", "Phone Screening", "L1 Interview", "Yet to Share", "L2 Interview",
      "Shared with Client", "Final Discussion", "Offer Released", "Joined", "Declined Offer",
      "Rejected", "Withdrawn", "No Show", "Buffer", "Hold"
    ),
    allowNull: false 
  },
  profile_stage: { type: DataTypes.STRING },
  status_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  candidate_email_id: { type: DataTypes.STRING, allowNull: false },
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
  attachments: { type: DataTypes.STRING }
});

// ✅ When a candidate is created, add to `ActiveList`
Candidate.afterCreate(async (candidate) => {
  try {
    await ActiveList.create({ ...candidate.get() });
    console.log(`✅ ActiveList updated for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error updating ActiveList:", error);
  }
});

// ✅ When a candidate is updated, update `ActiveList`
Candidate.afterUpdate(async (candidate) => {
  try {
    await ActiveList.update({ ...candidate.get() }, { where: { candidate_email_id: candidate.candidate_email_id } });
    console.log(`✅ ActiveList updated for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error updating ActiveList:", error);
  }
});

// ✅ When a candidate is deleted, remove from `ActiveList`
Candidate.afterDestroy(async (candidate) => {
  try {
    await ActiveList.destroy({ where: { candidate_email_id: candidate.candidate_email_id } });
    console.log(`✅ ActiveList entry removed for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error deleting from ActiveList:", error);
  }
});

module.exports = Candidate;
