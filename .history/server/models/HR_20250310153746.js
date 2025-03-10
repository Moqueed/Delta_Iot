const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const HR = sequelize.define("HR", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {  // Add email field
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isNumeric: true,
    },
  },
  role: {
    type: DataTypes.ENUM("HR Manager", "Recruiter", "HR Executive", "HR Assistant"),
    allowNull: false,
  },
}, { timestamps: false });

module.exports = HR;
