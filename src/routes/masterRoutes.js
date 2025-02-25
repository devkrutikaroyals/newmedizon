// masterRoutes.js
const express = require("express");
const { getMasters, createMaster } = require("../controllers/masterController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Route to get all masters
router.get("/", authMiddleware, roleMiddleware(["master"]), getMasters);

// Route to create a new master (admin-specific)
router.post("/", authMiddleware, roleMiddleware(["master"]), createMaster);

module.exports = router;
