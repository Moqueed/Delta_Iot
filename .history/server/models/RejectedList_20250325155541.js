const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RejectedList = sequelize.define("Rejected", {
    candidate_email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    candidate_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rejection_reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rejected_by_role: {
        type: DataTypes.ENUM("HR", "Admin"),
        allowNull: false,
    },
    status_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = RejectedList;