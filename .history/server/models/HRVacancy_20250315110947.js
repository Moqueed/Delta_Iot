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
    type: DataTypes.STRING, // Store skills as comma-separated values
    allowNull: false,
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
    type: DataTypes.STRING, // Store HR names as comma-separated values
    allowNull: false,
  },
});

module.exports = HRVacancy;