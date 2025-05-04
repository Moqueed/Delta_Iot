const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ActiveList = require("./ActiveList");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-password",
  },
});

const sendMail = async(email, subject, message) => {
  try{
    await transporter.sendMail({
      from: "your-email@gmail.com",
      to: email,
      subject,
      text: message,
    });
    console.log(`Email sent to ${email}`);
  } catch(error){
    console.error("Email failed", error);
  }
};

const Approval = sequelize.define("Approval", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  active_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "activeList",
      key: "id",
    },
    approval_status: { 
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"), 
      defaultValue: "Pending" 
    },    
  },
  HR_name: { type: DataTypes.STRING, allowNull: false },
  HR_mail: { type: DataTypes.STRING, allowNull: false },
  entry_date: { type: DataTypes.DATEONLY, allowNull: false },
  candidate_name: { type: DataTypes.STRING, allowNull: false },
  position: {
    type: DataTypes.ENUM("Python Developer", "EMD Developer", "Intern", "Trainee", "C++ Developer", "Accounts", "Developer"),
    allowNull: false,
  },
  department: {
    type: DataTypes.ENUM("IT", "EMDB", "HIGH", "Financial", "Python"),
    allowNull: false,
  },
  skills: { type: DataTypes.TEXT },
  previous_progress_status: { type: DataTypes.STRING, allowNull: false }, 
  requested_progress_status: { type: DataTypes.STRING, allowNull: false }, 
  profile_stage: { type: DataTypes.STRING },
  status_date: { type: DataTypes.DATEONLY, allowNull: false },
  candidate_email_id: { type: DataTypes.STRING, allowNull: false },
  contact_number: { type: DataTypes.STRING, allowNull: false },
  current_company: { type: DataTypes.STRING },
  current_location: { type: DataTypes.STRING },
  permanent_location: { type: DataTypes.STRING },
  qualification: { type: DataTypes.STRING },
  experience: { type: DataTypes.INTEGER },
  current_ctc: { type: DataTypes.STRING },
  expected_ctc: { type: DataTypes.STRING },
  band: { type: DataTypes.ENUM("L0", "L1", "L2", "L3", "L4") },
  reference: { type: DataTypes.STRING },
  notice_period: { type: DataTypes.STRING },
  comments: { type: DataTypes.TEXT },
  attachments: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM("Pending", "Approved", "Rejected"), defaultValue: "Pending" },
  requested_by: { type: DataTypes.STRING, allowNull: false },
  approved_by: { type: DataTypes.STRING },
},{
  tableName: "approvals",
  timestamps: false
});

// ✅ Use unique alias names
ActiveList.hasMany(Approval, { foreignKey: "active_list_id", as: "active_list_approvals" });
Approval.belongsTo(ActiveList, { foreignKey: "active_list_id", as: "related_active_list" });

// 🔥 After Update Hook - Handle Approval Decision
Approval.afterUpdate(async (approval) => {
  try {
    const { status, candidate_name, HR_mail, requested_progress_status, comments, approved_by } = approval;

    if (status === "Approved") {
      // ✅ Update Active List with new status
      await ActiveList.update(
        { progress_status: requested_progress_status },
        { where: { id: approval.active_list_id } }
      );

      console.log(`✅ ActiveList updated for Candidate: ${candidate_name}`);

      // 📩 Send Approval Email to HR
      await sendMail(
        HR_mail,
        `Candidate Approved ✅ - ${candidate_name}`,
        `Good news!\nThe candidate ${candidate_name} has been approved by ${approved_by}.\n\nNew Status: ${requested_progress_status}\n\nComments: ${comments || "No additional comments."}`
      );

    } else if (status === "Rejected") {
      // 🚫 Move to Rejected Table
      const Rejected = require("./Rejected");
      await Rejected.create({
        ...approval.dataValues,
        rejection_comments: comments,
      });

      console.log(`🚫 Candidate ${candidate_name} moved to Rejected table`);

      // 📩 Send Rejection Email to HR
      await sendMail(
        HR_mail,
        `Candidate Rejected ❌ - ${candidate_name}`,
        `Unfortunately, the candidate ${candidate_name} has been rejected by ${approved_by}.\n\nComments: ${comments || "No additional comments."}`
      );
    }
  } catch (error) {
    console.error("❌ Error processing approval:", error);
  }
});

module.exports = Approval;