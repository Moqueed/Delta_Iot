const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActiveList = sequelize.define('ActiveList', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    position_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'inactive'
    },
});

module.exports = ActiveList;