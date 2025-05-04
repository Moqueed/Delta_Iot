const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const HR = require("./HR");
const Candidate = require("./Candidate");

const AssignToHR = sequelize.define("AssignToHR", {
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.STRING, // e.g., store uploaded resume file path
    allowNull: true,
  },
}, {
  timestamps: true,
});

const assignments = await AssignToHR.findAll({
  include: [
    {
      model: HR,
      attributes: ['id', 'name', 'email'], // or whatever field names
    },
    {
      model: Candidate,
      attributes: ['id', 'name', 'email'],
    }
  ]
});


// Associations
AssignToHR.belongsTo(HR, { foreignKey: "hr_id" });
AssignToHR.belongsTo(Candidate, { foreignKey: "candidate_id" });

module.exports = AssignToHR;