const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
  attachments: { type: DataTypes.STRING },
},
{timestamps: false} //Disable timestamps
);

// Function to map progress_status to TotalData status
function mapStatus(progressStatus) {
  if (["Joined"].includes(progressStatus)) return "Joined";
  if (["Offer Released", "Final Discussion"].includes(progressStatus)) return "About to Join";
  if (["Buffer", "Hold"].includes(progressStatus)) return "Buffer";
  if (["Rejected", "Declined Offer"].includes(progressStatus)) return "Rejected";
  return "Master"; // Default category
}

// Hook to sync data after creating a candidate
Candidate.afterCreate(async (candidate) => {
  try {
    const TotalData = sequelize.models.TotalData; // Lazy import
    await TotalData.create({
      candidate_id: candidate.id,
      status: mapStatus(candidate.progress_status),
    });
    console.log(`✅ TotalData entry created for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error creating TotalData entry:", error);
  }
});

// Hook to sync data after updating a candidate
Candidate.afterUpdate(async (candidate) => {
  try {
    const TotalData = sequelize.models.TotalData; // Lazy import
    await TotalData.update(
      { status: mapStatus(candidate.progress_status) },
      { where: { candidate_id: candidate.id } }
    );
    console.log(`✅ TotalData entry updated for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error updating TotalData entry:", error);
  }
});

// Hook to remove data after deleting a candidate
Candidate.afterDestroy(async (candidate) => {
  try {
    const TotalData = sequelize.models.TotalData; // Lazy import
    await TotalData.destroy({ where: { candidate_id: candidate.id } });
    console.log(`✅ TotalData entry removed for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error deleting TotalData entry:", error);
  }
});

module.exports = Candidate;
