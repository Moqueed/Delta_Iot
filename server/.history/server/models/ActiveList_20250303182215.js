const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActiveList = sequelize.define("ActiveList", {
  job_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  position: { type: DataTypes.STRING, allowNull: false },
  skills: { type: DataTypes.TEXT },
  department: { type: DataTypes.STRING, allowNull: false },
  vacancy: { type: DataTypes.INTEGER, defaultValue: 1 },
  manager: { type: DataTypes.STRING },
  maximum_experience: { type: DataTypes.INTEGER },
  minimum_experience: { type: DataTypes.INTEGER },
  job_description: { type: DataTypes.TEXT }
});

module.exports = ActiveList;
