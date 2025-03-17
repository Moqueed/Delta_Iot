const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const HRVacancy = require("./HRVacancy");

const ActivePosition = sequelize.define("ActivePosition", {
  job_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  skills: {
    type: DataTypes.JSON, // Store skills as comma-separated values
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vacancy: {
    type: DataTypes.INTEGER, // Number of available positions
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
    type: DataTypes.JSON, // Store HR names as comma-separated values
    allowNull: false,
  },
});

// Automatically reflect new positions in HRVacancy
ActivePosition.afterCreate(async (position) => {
  await HRVacancy.create({
    job_id: position.job_id,
    position: position.position,
    skills: position.skills,
    department: position.department,
    vacancy: position.vacancy,
    manager: position.manager,
    minimum_experience: position.minimum_experience,
    maximum_experience: position.maximum_experience,
    job_description: position.job_description,
    HRs: position.HRs,
  });
});


module.exports = ActivePosition;
