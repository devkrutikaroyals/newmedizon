// const express = require("express");
// const { register, loginUser , authorizeManufacturer, fetchPendingManufacturers } = require("../controllers/authController");

// const router = express.Router();

// // Route to register user
// router.post("/register", register);

// // Route to login user
// router.post("/login", loginUser ); // Ensure this route is defined

// // Route to authorize manufacturer (admin only)
// router.post("/authorize", authorizeManufacturer);

// // Route to fetch pending manufacturers
// router.get("/pending-manufacturers", fetchPendingManufacturers);

// module.exports = router;

const express = require("express");
const {
  register,
  loginUser,
  authorizeManufacturer,
  fetchPendingManufacturers,
  updatePassword,
  declineManufacturer, // Add the new function
} = require("../controllers/authController");

const router = express.Router();

// Route to register user
router.post("/register", register);

// Route to login user
router.post("/login", loginUser);

// Route to authorize manufacturer (admin only)
router.post("/authorize", authorizeManufacturer);

// Route to fetch pending manufacturers
router.get("/pending-manufacturers", fetchPendingManufacturers);

// Route to update password
router.put("/update-password", updatePassword);

// Route to decline manufacturer
router.post("/decline-manufacturer", declineManufacturer); // Add the new route

module.exports = router;