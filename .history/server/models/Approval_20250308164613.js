const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ActiveList = require("./ActiveList");

const Approval = sequelize.define("Approval", {
  active_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'activelist',  // use the exact table name as defined in your ActiveList model
      key: 'id'
    }
  },
  
  HR_name: { type: DataTypes.STRING, allowNull: false },
  HR_mail: { type: DataTypes.STRING, allowNull: false },
  entry_date: { type: DataTypes.DATEONLY, allowNull: false },
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
  previous_progress_status: { type: DataTypes.STRING, allowNull: false }, // Old status
  requested_progress_status: { type: DataTypes.STRING, allowNull: false }, // New status
  profile_stage: { type: DataTypes.STRING },
  status_date: { type: DataTypes.DATEONLY, allowNull: false },
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
  status: { type: DataTypes.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" },
  requested_by: { type: DataTypes.STRING, allowNull: false },
  approved_by: { type: DataTypes.STRING }
});

ActiveList.hasMany(Approval, { foreignKey: "active_list_id", as: "approvals" });
Approval.belongsTo(ActiveList, { foreignKey: "active_list_id", as: "activeList" });

module.exports = Approval;
