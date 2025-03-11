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
{ timestamps: false } // Disable timestamps
);

// Function to map progress_status to TotalData status
function mapStatus(progressStatus) {
  const normalizedStatus = progressStatus?.trim().toLowerCase();

  if (["joined"].includes(normalizedStatus)) return "Joined";
  if (["offer released", "final discussion"].includes(normalizedStatus)) return "About to Join";
  if (["buffer", "hold"].includes(normalizedStatus)) return "Buffer";
  if (["rejected", "declined offer"].includes(normalizedStatus)) return "Rejected";

  return "Master"; // Default category
}


// Hook to sync data after creating a candidate

Candidate.afterCreate(async (candidate, options) => {
  try {
    const TotalData = sequelize.models.TotalData; // Lazy import
    const ActiveList = sequelize.models.ActiveList; // Lazy import

    console.log(`📌 Creating TotalData entry with status: "${mapStatus(candidate.progress_status)}"`);

    await TotalData.create({
      candidate_id: candidate.id,
      status: mapStatus(candidate.progress_status),
      count: 1,
    });

    // ✅ Updated ActiveList entry with default values
    const activeListEntry = await ActiveList.create({
      candidate_id: candidate.id,
      candidate_name: candidate.candidate_name,
      position: candidate.position,
      department: candidate.department,
      progress_status: candidate.progress_status || "Application Received", // Default value
      status_date: candidate.status_date || new Date(), // Default to today if missing
      entry_date: candidate.entry_date
    });

    console.log(`✅ TotalData & ActiveList entry created for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error creating TotalData or ActiveList entry:", error);
  }
});


// Hook to sync data after updating a candidate
Candidate.afterUpdate(async (candidate) => {
  try {
    const TotalData = sequelize.models.TotalData;
    await TotalData.update(
      { status: mapStatus(candidate.progress_status) },
      { where: { candidate_id: candidate.id } }
    );

    const ActiveList = sequelize.models.ActiveList;
    await ActiveList.update(
      {
        position: candidate.position,
        department: candidate.department,
        progress_status: candidate.progress_status,
      },
      { where: { candidate_id: candidate.id } }
    );

    console.log(`✅ TotalData & ActiveList entry updated for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error updating TotalData or ActiveList entry:", error);
  }
});

// Hook to remove data after deleting a candidate
Candidate.afterDestroy(async (candidate) => {
  try {
    const TotalData = sequelize.models.TotalData;
    await TotalData.destroy({ where: { candidate_id: candidate.id } });

    const ActiveList = sequelize.models.ActiveList;
    await ActiveList.destroy({ where: { candidate_id: candidate.id } });

    console.log(`✅ TotalData & ActiveList entry removed for Candidate: ${candidate.candidate_name}`);
  } catch (error) {
    console.error("❌ Error deleting TotalData or ActiveList entry:", error);
  }
});

module.exports = Candidate;
