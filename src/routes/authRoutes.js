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
  declineManufacturer, // Import the new function
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
router.put("/update-password", updatePassword); // Add the new route

router.post("/decline-manufacturer", declineManufacturer);

module.exports = router;