const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Candidate = sequelize.define(
  "Candidate",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    HR_name: { type: DataTypes.STRING, allowNull: false },
    HR_mail: { type: DataTypes.STRING, allowNull: false },
    entry_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    candidate_name: { type: DataTypes.STRING, allowNull: false },
    position: {
      type: DataTypes.ENUM("Python Developer", "EMD Developer", "Intern", "Trainee", "C++ Developer", "Accounts","React Developer","UI Developer", "Developer"),
      allowNull: false,
    },
    department: {
      type: DataTypes.ENUM("IT", "EMDB", "HIGH", "Financial", "Python"),
      allowNull: false,
    },
    skills: { type: DataTypes.TEXT },
    progress_status: {
      type: DataTypes.ENUM(
        "Application Received",
        "Phone Screening",
        "L1 Interview",
        "Yet to Share",
        "L2 Interview",
        "Shared with Client",
        "Final Discussion",
        "Offer Released",
        "Joined",
        "Declined Offer",
        "Rejected",
        "Withdrawn",
        "No Show",
        "Buffer",
        "Hold"
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
  { 
    tableName: "candidates",
    timestamps: false }
);

// ✅ Only sync to ActiveList on creation
// Candidate.afterCreate(async (candidate) => {
//   try {
//     const ActiveList = sequelize.models.ActiveList;
//     await ActiveList.create({
//       candidate_id: candidate.id,
//       candidate_name: candidate.candidate_name,
//       position: candidate.position,
//       department: candidate.department,
//       progress_status: candidate.progress_status || "Application Received",
//       status_date: candidate.status_date || new Date(),
//       entry_date: candidate.entry_date,
//     });

//     console.log(`✅ ActiveList entry created for Candidate: ${candidate.candidate_name}`);
//   } catch (error) {
//     console.error("❌ Error creating ActiveList entry:", error);
//   }
// });

// // ✅ Only sync to ActiveList on update
// Candidate.afterUpdate(async (candidate) => {
//   try {
//     const ActiveList = sequelize.models.ActiveList;
//     await ActiveList.update(
//       {
//         position: candidate.position,
//         department: candidate.department,
//         progress_status: candidate.progress_status || "Application Received",
//       },
//       { where: { candidate_id: candidate.id } }
//     );

//     console.log(`✅ ActiveList entry updated for Candidate: ${candidate.candidate_name}`);
//   } catch (error) {
//     console.error("❌ Error updating ActiveList entry:", error);
//   }
// });

// // ✅ Only remove from ActiveList on deletion
// Candidate.afterDestroy(async (candidate) => {
//   try {
//     const ActiveList = sequelize.models.ActiveList;
//     await ActiveList.destroy({ where: { candidate_id: candidate.id } });

//     console.log(`✅ ActiveList entry removed for Candidate: ${candidate.candidate_name}`);
//   } catch (error) {
//     console.error("❌ Error deleting ActiveList entry:", error);
//   }
// });

module.exports = Candidate;