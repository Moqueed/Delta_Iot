const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TotalData = sequelize.define("TotalData", {
  candidate_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  status: {
    type: DataTypes.ENUM("Master", "Joined", "About to Join", "Buffer", "Rejected"),
    allowNull: false,
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


module.exports = TotalData;
