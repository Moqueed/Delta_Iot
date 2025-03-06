const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HRVacancy = sequelize.define("HRVacancy", {
  job_id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  position: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  department: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = HRVacancy;
