const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensure name isn't just empty spaces
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // Ensure a valid email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100], // Ensure password is between 8-100 chars
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "hr"),
      allowNull: false,
      defaultValue: "hr", // Set a default role if not provided
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
  }
);

module.exports = User;
