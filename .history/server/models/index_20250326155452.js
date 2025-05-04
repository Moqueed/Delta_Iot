const sequelize = require("../config/database");

// Import models


const ActivePosition = require("./ActivePosition");
const HRVacancy = require("./HRVacancy");
const Candidate = require("./Candidate");
const { TotalMasterData } = require("./TotalData");


// Define relationships after model imports
function setupAssociations() {
  ActivePosition.hasOne(HRVacancy, { foreignKey: "job_id", onDelete: "CASCADE" });
  HRVacancy.belongsTo(ActivePosition, { foreignKey: "job_id" });

  Candidate.hasOne(TotalMasterData, { foreignKey: "candidate_id" });
  TotalMasterData.belongsTo(Candidate, { foreignKey: "candidate_id" });
}

// Execute association setup
setupAssociations();

module.exports = { sequelize, ActivePosition, HRVacancy, Candidate, TotalMasterData };