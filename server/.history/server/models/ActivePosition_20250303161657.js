const {DataTypes, where} = require("sequelize");
const sequelize = require("../config/database");


const ActivePosition = sequelize.define("ActivePosition", {
    job_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    skills: {
        type: DataTypes.STRING, //store skills as comma-separated values
        allowNull: false,
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vacancy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    minimum_experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    maximum_experience: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    job_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    hooks: {
        afterCreate: async(position) => {
            await HRVacancy.update(
                {vacancy: position.vacancy, job_description: position.job_description},
                {where: {job_id: position.job_id}}
            )
        }
    }
})

module.exports = ActivePosition;