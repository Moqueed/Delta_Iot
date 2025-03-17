const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HRVacancy = sequelize.define("HRVacancy", {
  job_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON, // ✅ Allows arrays
    allowNull: false,
    validate: {
      isNonEmptyArray(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("Skills must be a non-empty array");
        }
      },
    },
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vacancy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  manager: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minimum_experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maximum_experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  HRs: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isNonEmptyArray(value) {
        if (!Array.isArray(value) || value.length === 0) {
          throw new Error("HRs must be a non-empty array");
        }
      },
    },
  },
});

module.exports = HRVacancy;
