const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const HR = require("./HR");
const Candidate = require("./Candidate");

const AssignToHR = sequelize.define("AssignToHR", {
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.STRING, // Store file path or URL
    allowNull: true, // HR manually uploads attachments
  },
}, { timestamps: false });

// Associations
AssignToHR.belongsTo(HR, { foreignKey: "hr_id" });
AssignToHR.belongsTo(Candidate, { foreignKey: "candidate_id" });

module.exports = AssignToHR;
