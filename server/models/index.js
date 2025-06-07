// Import models
const ActivePosition = require("./ActivePosition");
const HRVacancy = require("./HRVacancy");
const Candidate = require("./Candidate");
const HR = require("./HR");
const AssignToHR = require("./AssignToHR");
const AssignedCandidate = require("./AssignedCandidate");
const sequelize = require("../config/database");
// const { TotalMasterData } = require("./TotalData");


const models = {
  sequelize,
  ActivePosition,
  HRVacancy,
  Candidate,
  HR,
  AssignToHR,
  AssignedCandidate
};


// // Setup associations manually
// if (ActivePosition.associate) ActivePosition.associate(models);
// if (HRVacancy.associate) HRVacancy.associate(models);
// if (Candidate.associate) Candidate.associate(models);
// if (HR.associate) HR.associate(models);
// if (AssignToHR.associate) AssignToHR.associate(models);

// ✅ Setup associations (recommended way)
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Optional: Export all models
module.exports = {
  sequelize,
  ...models,
};