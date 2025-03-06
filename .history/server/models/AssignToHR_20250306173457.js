const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const HR = require("./HR");
const Candidate = require("./Candidate");

const AssignToHR = sequelize.define(
  "AssignToHR",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hr_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: HR, key: "id" },
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Candidate, key: "id" },
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.STRING, // Stores file path or URL
      allowNull: true,
    },
  },
  { timestamps: false }
);

// ✅ Associations
AssignToHR.belongsTo(HR, { foreignKey: "hr_id" });
AssignToHR.belongsTo(Candidate, { foreignKey: "candidate_id" });

// ✅ Auto-sync resume (attachments) from Candidate table before creating an assignment
AssignToHR.beforeCreate(async (assignment) => {
  const candidate = await Candidate.findByPk(assignment.candidate_id);
  if (candidate) {
    assignment.attachments = candidate.attachments; // Sync resume
  }
});

module.exports = AssignToHR;
