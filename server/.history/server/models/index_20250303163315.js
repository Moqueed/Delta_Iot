const sequelize = require("../config/database");
const ActivePosition = require("./ActivePosition");
const HRVacancy = require("./HRVacancy");

// Define one-to-one relationship (Each Active Position creates an HR Vacancy)
ActivePosition.hasOne(HRVacancy, { foreignKey: "job_id", onDelete: "CASCADE" });
HRVacancy.belongsTo(ActivePosition, { foreignKey: "job_id" });

module.exports = { sequelize, ActivePosition, HRVacancy };
