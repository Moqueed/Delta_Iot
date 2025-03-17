const sequelize = require("../config/database");

// Import models

const TotalData = require("./TotalData");
const ActivePosition = require("./ActivePosition");
const HRVacancy = require("./HRVacancy");
const Candidate = require("./candidate");

// Define relationships after model imports
function setupAssociations() {
  ActivePosition.hasOne(HRVacancy, { foreignKey: "job_id", onDelete: "CASCADE" });
  HRVacancy.belongsTo(ActivePosition, { foreignKey: "job_id" });

  Candidate.hasOne(TotalData, { foreignKey: "candidate_id" });
  TotalData.belongsTo(Candidate, { foreignKey: "candidate_id" });
}

// Execute association setup
setupAssociations();

module.exports = { sequelize, ActivePosition, HRVacancy, Candidate, TotalData };