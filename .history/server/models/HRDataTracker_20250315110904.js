const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HR = require("./HR");
const Candidate = require("./candidate");

const HRDataTracker = sequelize.define("HRDataTracker", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hr_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: HR,
      key: "id",
    },
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: "id",
    },
  },
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

// ✅ Define Associations
HR.hasMany(HRDataTracker, { foreignKey: "hr_id" });
Candidate.hasMany(HRDataTracker, { foreignKey: "candidate_id" });

HRDataTracker.belongsTo(HR, { foreignKey: "hr_id" });
HRDataTracker.belongsTo(Candidate, { foreignKey: "candidate_id" });

module.exports = HRDataTracker;