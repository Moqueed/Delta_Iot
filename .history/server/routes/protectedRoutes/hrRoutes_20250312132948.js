const express = require("express");
const router = express.Router();
const { verifyToken, authorizeRoles } = require("../middleware/auth");

// ✅ HR Route
router.get("/hr-dashboard", verifyToken, authorizeRoles(["hr"]), (req, res) => {
  res.json({ message: `Welcome HR: ${req.user.email}` });
});

module.exports = router;
