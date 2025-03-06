require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const activePositionRoutes = require("./routes/activePositionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const hrVacancyRoutes = require("./routes/hrVacancyRoutes"); // Keep this
const activeListRoutes = require("./routes/activeListRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Running! Welcome to Delta IoT API.");
});

app.use("/positions", activePositionRoutes);
app.use("/candidates", candidateRoutes);
app.use("/hrvacancies", hrVacancyRoutes); // Keep this
app.use("/activelist", activeListRoutes)

// Sync Database & Start Server
sequelize.sync({ alter: true }).then(() => { // Use 'alter: true'
  console.log("✅ Database Synced!");

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
