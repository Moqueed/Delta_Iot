const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// ✅ Notification model for tracking emails
const Notification = sequelize.define(
  "Notification",
  {
    recipient_email: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM("Sent", "Failed"), defaultValue: "Sent" },
  },
  { timestamps: true }
);

module.exports = Notification;