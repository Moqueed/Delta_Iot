require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const activePositionRoutes = require("./routes/activePositionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(" Server is Running! Welcome to Delta IoT API.");
});

app.use("/positions", activePositionRoutes);
app.use("/candidates", candidateRoutes);
// Sync Database & Start Server
sequelize.sync({ force: true }).then(() => {
  console.log("✅ Database Synced!");
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
});
