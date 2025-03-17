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
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error("Skills must be an array");
        }
        if (value.length === 0) {
          throw new Error("Skills cannot be empty");
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
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error("HRs must be an array");
        }
        if (value.length === 0) {
          throw new Error("HRs cannot be empty");
        }
      },
    },
  },
});

module.exports = HRVacancy;
