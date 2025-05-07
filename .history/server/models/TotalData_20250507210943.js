const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TotalMasterData = sequelize.define('TotalMasterData', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  progress_status: { type: DataTypes.STRING, allowNull: false },
  status_date: new Date(),
  entry_date: activeRecord.entry_date || new Date(),
}, { tableName: 'total_master_data', timestamps: false });

const AboutToJoin = sequelize.define('AboutToJoin', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  joining_date: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'about_to_join', timestamps: false });

const NewlyJoined = sequelize.define('NewlyJoined', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  joining_date: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'newly_joined', timestamps: false });

const BufferData = sequelize.define('BufferData', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING, allowNull: false },
  status_reason: { type: DataTypes.TEXT }
}, { tableName: 'buffer_data', timestamps: false });

module.exports = { TotalMasterData, AboutToJoin, NewlyJoined, BufferData };
