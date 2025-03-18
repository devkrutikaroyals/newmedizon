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

// const express = require("express");
// const {
//   register,
//   loginUser,
//   authorizeManufacturer,
//   fetchPendingManufacturers,
//   updatePassword,

  
// } = require("../controllers/authController");

// const router = express.Router();

// // Route to register user
// router.post("/register", register);

// // Route to login user
// router.post("/login", loginUser);

// // Route to authorize manufacturer (admin only)
// router.post("/authorize", authorizeManufacturer);

// // Route to fetch pending manufacturers
// router.get("/pending-manufacturers", fetchPendingManufacturers);

// // Route to update password
// router.put("/update-password", updatePassword); // Add the new route



// module.exports = router;



// const express = require("express");
// const {
//   register,
//   loginUser,
//   authorizeManufacturer,
//   fetchPendingManufacturers,
//   updatePassword,
//   declineManufacturer, // Add the new function
// } = require("../controllers/authController");

// const router = express.Router();

// // Route to register user
// router.post("/register", register);

// // Route to login user
// router.post("/login", loginUser);

// // Route to authorize manufacturer (admin only)
// router.post("/authorize", authorizeManufacturer);

// // Route to fetch pending manufacturers
// router.get("/pending-manufacturers", fetchPendingManufacturers);

// // Route to update password
// router.put("/update-password", updatePassword);

// // Route to decline manufacturer
// router.post("/decline-manufacturer", declineManufacturer); // Add the new route

// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  register,
  loginUser,
  approveManufacturer,
  fetchPendingManufacturers,
  updatePassword,
  declineManufacturer,
  authorizeManufacturer, // ✅ Ensure this function exists in authController.js
} = require("../controllers/authController");

// Route to register user
router.post("/register", register);

// Route to login user
router.post("/login", loginUser);

// Route to authorize manufacturer (admin only)
router.post("/authorize", authorizeManufacturer); // 🔴 If this is undefined, remove it!

// Route to fetch pending manufacturers
router.get("/pending-manufacturers", fetchPendingManufacturers);

// Route to update password
router.put("/update-password", updatePassword);

// Route to decline manufacturer
router.post("/decline-manufacturer", declineManufacturer);

// Route to approve manufacturer (via email link)
router.get("/approve-manufacturer", approveManufacturer);

module.exports = router;
