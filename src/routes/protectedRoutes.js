const express = require("express");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Manufacturer Dashboard
router.get("/manufacturer-dashboard", auth, (req, res) => {
  if (req.user.role !== "manufacturer") {
    return res.status(403).json({ message: "Access Denied" });
  }
  res.json({ message: "Welcome to Manufacturer Dashboard" });
});

// Admin Dashboard
router.get("/admin-dashboard", auth, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied" });
  }
  res.json({ message: "Welcome to Admin Dashboard" });
});

module.exports = router;
