require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const Candidate = require("./models/Candidate");
const TotalData = require("./models/TotalData");
const activePositionRoutes = require("./routes/activePositionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const hrVacancyRoutes = require("./routes/hrVacancyRoutes"); // Keep this
const activeListRoutes = require("./routes/activeListRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const totalDataRoutes = require("./routes/totalDataRoutes");
const hrRoutes = require("./routes/hrRoutes");
const hrDataTrackerRoutes = require("./routes/hrDataTrackerRoutes");
const assignToHRRoutes = require("./routes/assignToHRRoutes");
const userRoutes = require("./routes/userRoutes");
const protectedAdminRoutes = require("./routes/protectedRoutes/adminRoutes");
const protectedHrRoutes = require("./routes/protectedRoutes/hrRoutes");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is Running! Welcome to Delta IoT API.");
});

app.use("/positions", activePositionRoutes);
app.use("/candidates", candidateRoutes);
app.use("/hrvacancies", hrVacancyRoutes); // Keep this
app.use("/activelist", activeListRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/uploads", uploadRoutes);
app.use("/totaldata", totalDataRoutes);
app.use("/hr", hrRoutes);
app.use("/hr-data-tracker", hrDataTrackerRoutes);
app.use("/assign-to-hr", assignToHRRoutes);
app.use("/auth", userRoutes);
app.use("/admin/protected", protectedAdminRoutes);
app.use("/hr/protected", protectedHrRoutes);



// Sync Database & Start Server
sequelize.sync({ alter: true }).then(() => { // Use 'alter: true'
  console.log("✅ Database Synced!");

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
