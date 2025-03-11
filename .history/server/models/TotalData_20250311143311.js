const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TotalData = sequelize.define("TotalData", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  status: { type: DataTypes.STRING, allowNull: false },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // ✅ Ensure count is never NULL
  },
}, {
  tableName: "TotalData",
  timestamps: false,
});


module.exports = TotalData;
