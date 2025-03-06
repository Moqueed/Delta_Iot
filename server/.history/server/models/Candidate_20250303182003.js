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
  progress_status: { 
    type: DataTypes.ENUM(
      "Application Received", "Phone Screening", "L1 Interview", "Yet to Share", "L2 Interview",
      "Shared with Client", "Final Discussion", "Offer Released", "Joined", "Declined Offer",
      "Rejected", "Withdrawn", "No Show", "Buffer", "Hold"
    ),
    allowNull: false 
  },
  profile_stage: { type: DataTypes.STRING },
  department: { 
    type: DataTypes.ENUM("IT", "EMDB", "HIGH", "Financial", "Python"),
    allowNull: false
  },
  status_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  candidate_email_id: { type: DataTypes.STRING, allowNull: false },
  contact_number: { type: DataTypes.STRING, allowNull: false },
  current_company: { type: DataTypes.STRING },
  current_location: { type: DataTypes.STRING },
  permanent_location: { type: DataTypes.STRING },
  qualification: { type: DataTypes.STRING },
  skills: { type: DataTypes.TEXT },
  experience: { type: DataTypes.INTEGER },
  current_ctc: { type: DataTypes.STRING },
  expected_ctc: { type: DataTypes.STRING },
  band: { type: DataTypes.ENUM("L0", "L1", "L2", "L3", "L4") },
  reference: { type: DataTypes.STRING },
  notice_period: { type: DataTypes.STRING },
  comments: { type: DataTypes.TEXT },
  attachments: { type: DataTypes.STRING } // Can store file URLs if using a storage service
});

// After a candidate is added, update ActiveList
Candidate.afterCreate(async (candidate) => {
  await ActiveList.create({
    job_id: candidate.id,
    position: candidate.position,
    skills: candidate.skills,
    department: candidate.department,
    vacancy: 1, // Default 1 vacancy per candidate
    manager: candidate.HR_name,
    maximum_experience: candidate.experience ? candidate.experience + 2 : null,
    minimum_experience: candidate.experience ? candidate.experience - 2 : null,
    job_description: "Candidate added via HR recruitment."
  });
});

module.exports = Candidate;
