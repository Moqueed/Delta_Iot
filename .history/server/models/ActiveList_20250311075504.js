const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ActiveList = sequelize.define("ActiveList", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // ✅ This ensures that the table has an `id`
  },
  candidate_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  progress_status: { type: DataTypes.STRING, allowNull: false },
  entry_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW }
},
{ tableName: "ActiveList",
  timestamps: false });

module.exports = ActiveList;
