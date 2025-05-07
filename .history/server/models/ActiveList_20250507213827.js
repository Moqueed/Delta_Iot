const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Candidate = require("./Candidate");

const ActiveList = sequelize.define(
  "ActiveList",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Candidate,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      unique: true, // Ensure a candidate appears only once in ActiveList
    },
    candidate_name: { type: DataTypes.STRING, allowNull: false },
    candidate_email_id: { type: DataTypes.STRING, allowNull: false },
    HR_name: { type: DataTypes.STRING, allowNull: false },
    HR_mail: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    progress_status: {
      type: DataTypes.ENUM(
        "Application Received",
        "Phone Screening",
        "L1 Interview",
        "Yet to Share",
        "L2 Interview",
        "Shared with Client",
        "Final Discussion",
        "Offer Released",
        "Joined",
        "Declined Offer",
        "Rejected",
        "Withdrawn",
        "No Show",
        "Buffer",
        "Hold",
        "HR Round Cleared"
      ),
      allowNull: false,
      defaultValue: "Application Received",
    },
    entry_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "activeList",
    timestamps: false,
  }
);

ActiveList.belongsTo(Candidate, {
  foreignKey: "candidate_id",
  onDelete: "CASCADE",
});

ActiveList.beforeUpdate(async (activeList, options) => {
  const newProgressStatus = activeList.progress_status; // ✅ Extracted safely

  const allowedStatuses = [
    "application received",
    "phone screening",
    "l1 interview",
    "yet to share",
    "l2 interview",
    "shared with client"
  ];

  if (allowedStatuses.includes(newProgressStatus.toLowerCase())) {
    // Add your logic to trigger movement to Total Master Data
    console.log("🔁 Move to Total Master Data or enable button");

    // Optional: Call a function to insert into TotalMasterData table here
  }
});



module.exports = ActiveList;
