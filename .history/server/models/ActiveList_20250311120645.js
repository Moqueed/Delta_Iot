const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Candidate = require("./Candidate"); // ✅ Import Candidate model

const ActiveList = sequelize.define("ActiveList", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // ✅ Only ONE primary key
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate, // ✅ Use imported Candidate model instead of "Candidates"
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  progress_status: { type: DataTypes.STRING, allowNull: false },
  entry_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: "ActiveList",
  timestamps: false,
});

// ✅ Define Foreign Key Relationship AFTER Importing Candidate
ActiveList.belongsTo(Candidate, { foreignKey: "candidate_id" });

module.exports = ActiveList;
