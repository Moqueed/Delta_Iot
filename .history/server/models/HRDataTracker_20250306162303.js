const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Candidate = require("./Candidate");
const HR = require("./HR");

const HRDataTracker = sequelize.define("HRDataTracker", {
  status: {
    type: DataTypes.ENUM(
      "Application Received", "Phone Screening", "L1 Interview", "Yet to Share", "L2 Interview",
      "Shared with Client", "Final Discussion", "Offer Released", "Joined", "Declined Offer",
      "Rejected", "Withdrawn", "No Show", "Buffer", "Hold"
    ),
    allowNull: false,
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  }
}, { timestamps: false });

// Associations
HRDataTracker.belongsTo(HR, { foreignKey: "hr_id" });
HRDataTracker.belongsTo(Candidate, { foreignKey: "candidate_id" });

module.exports = HRDataTracker;
