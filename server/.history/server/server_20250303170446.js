require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const activePositionRoutes = require("./routes/activePositionRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/positions", activePositionRoutes);

// Sync Database & Start Server
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database Synced!");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
