const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const HrCredential = sequelize.define('HrCredential', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
});

module.exports = HrCredential;