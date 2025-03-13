const jwt = require("jsonwebtoken");

// ✅ Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ Role-Based Access Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

const isHR = (req, res, next) => {
  if (req.user.role !== "hr") {
    return res.status(403).json({ message: "Access denied: HR only" });
  }
  next();
};

module.exports = { verifyToken, isAdmin, isHR };
