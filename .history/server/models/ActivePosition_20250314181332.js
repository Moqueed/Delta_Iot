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
    type: DataTypes.ARRAY(DataTypes.STRING), // Store as array of strings
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
    validate: {
      isInt: { msg: "Vacancy must be a valid number" },
      min: { args: [1], msg: "Vacancy must be at least 1" },
    },
  },
  manager: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  minimum_experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [0], msg: "Minimum experience cannot be negative" },
    },
  },
  maximum_experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isGreaterThanMin(value) {
        if (value < this.minimum_experience) {
          throw new Error("Maximum experience must be greater than minimum experience");
        }
      },
    },
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  HRs: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Store as array of strings
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

// Automatically sync new positions into HRVacancy
ActivePosition.afterCreate(async (position) => {
  try {
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
  } catch (error) {
    console.error("Failed to sync with HRVacancy:", error.message);
  }
});

module.exports = ActivePosition;
