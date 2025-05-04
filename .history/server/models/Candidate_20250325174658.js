const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Candidate = sequelize.define(
  "Candidate",
  {
    candidate_name: { type: DataTypes.STRING, allowNull: false },
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
    attachments: { type: DataTypes.STRING },
  },
  { timestamps: false }
);

module.exports = Candidate;
