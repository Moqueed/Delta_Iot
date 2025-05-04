const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const RejectedList = sequelize.define("Rejected", {
    candidate_email_id: {
        type: DataTypes.STRING,
        allowNull: 
    }
})