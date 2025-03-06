const sequelize = require("../config/database");
const ActiveList = require("./ActiveList");
const HrCredential = require("./HrCredential");
const Vacancy = require("./Vacancy");

ActiveList.afterUpdate(async (activePosition) => {
  // sync vacancies whenever a position in activeList is activated
  if (activePosition.status === "active") {
    await Vacancy.findOrCreate({
      where: { position_name: activePosition.position_name },
      defaults: { position_name: activePosition.position_name },
    });
  } else {
    await Vacancy.destroy({
      where: { position_name: activePosition.position_name },
    });
  }
});

module.exports = {sequelize, HrCredential, ActiveList, Vacancy};