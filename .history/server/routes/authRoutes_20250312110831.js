const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ✅ Register User (Admin or HR)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// 🔑 Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// 🛡️ Middleware for Role Check
const authMiddleware = (roles) => (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!roles.includes(decoded.role)) return res.status(403).json({ message: "Access denied" });

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token", error });
  }
};

// 🔐 Example: Admin-only route
router.get("/admin-dashboard", authMiddleware(["admin"]), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

// 🔐 Example: HR-only route
router.get("/hr-dashboard", authMiddleware(["hr"]), (req, res) => {
  res.status(200).json({ message: "Welcome, HR!" });
});

module.exports = router;
