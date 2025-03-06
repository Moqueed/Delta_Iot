const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Vacancy = sequelize.define('Vacancy', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    position_name: {type: DataTypes.STRING, allowNull: false},
});

module.exports = Vacancy;