// const Master = require("../models/Master");

// const Manufacturer = require("../models/Manufacturer");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// // Register User
// exports.register = async (req, res) => {
//   try {
//     let { name, email, password, role } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     role = role.trim().toLowerCase();

//     // // Prevent multiple Master registrations
//     if (role === "master") {
//       const existingMaster = await Master.findOne();
//       if (existingMaster) {
//         return res.status(400).json({ message: "Only one Master can be registered." });
//       }
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     let newUser ;

//     if (role === "master") {
//       newUser  = new Master({ name, email, password: hashedPassword, role });
//     } else {
//       newUser  = new Manufacturer({ name, email, password: hashedPassword, role, isAuthorized: false });
//     }

//     await newUser .save();

//     res.status(201).json({
//       message: role === "master" ? "Master registered successfully." : "Manufacturer registered, waiting for approval.",
//       user: newUser ,
//     });
//   } catch (error) {
//     console.error("🔥 Registration Error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Login User
// // Login User
// exports.loginUser  = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password || !role) {
//       return res.status(400).json({ message: "All fields are required." });
//     }

//     let user;
//     if (role === "master") {
//       user = await Master.findOne({ email });
//     } else if (role === "manufacturer") {
//       user = await Manufacturer.findOne({ email });

//       // Check if Manufacturer is approved
//       if (user && !user.isAuthorized) {
//         return res.status(403).json({ message: "Awaiting Master Admin approval." });
//       }
//     } else {
//       return res.status(400).json({ message: "Invalid role specified." });
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User  not found." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user,
//       redirect: user.role === "master" ? "/master-dashboard" : "/manufacturer-dashboard",
//     });
//   } catch (error) {
//     console.error("🔥 Login Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Authorize Manufacturer
// exports.authorizeManufacturer = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     const manufacturer = await Manufacturer.findOne({ email });

//     if (!manufacturer) {
//       return res.status(404).json({ message: "Manufacturer not found." });
//     }

//     if (manufacturer.isAuthorized) {
//       return res.status(400).json({ message: "Manufacturer is already approved." });
//     }

//     manufacturer.isAuthorized = true;
//     await manufacturer.save();

//     res.status(200).json({ message: "Manufacturer approved successfully." });
//   } catch (error) {
//     console.error("🔥 Authorization Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Fetch Pending Manufacturers
// exports.fetchPendingManufacturers = async (req, res) => {
//   try {
//     const pendingManufacturers = await Manufacturer.find({ isAuthorized: false });
//     res.status(200).json(pendingManufacturers);
//   } catch (error) {
//     console.error("🔥 Error fetching pending manufacturers:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


const Master = require("../models/Master");
const Manufacturer = require("../models/Manufacturer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register User
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    role = role.trim().toLowerCase();

    // Prevent multiple Master registrations
    if (role === "master") {
      const existingMaster = await Master.findOne();
      if (existingMaster) {
        return res.status(400).json({ message: "Only one Master can be registered." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (role === "master") {
      newUser = new Master({ name, email, password: hashedPassword, role });
    } else {
      newUser = new Manufacturer({ name, email, password: hashedPassword, role, isAuthorized: false });
    }

    await newUser.save();

    res.status(201).json({
      message: role === "master" ? "Master registered successfully." : "Manufacturer registered, waiting for approval.",
      user: newUser,
    });
  } catch (error) {
    console.error("🔥 Registration Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let user;
    if (role === "master") {
      user = await Master.findOne({ email });
    } else if (role === "manufacturer") {
      user = await Manufacturer.findOne({ email });

      // Check if Manufacturer is approved
      if (user && !user.isAuthorized) {
        return res.status(403).json({ message: "Awaiting Master Admin approval." });
      }
    } else {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
      redirect: user.role === "master" ? "/master-dashboard" : "/manufacturer-dashboard",
    });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Authorize Manufacturer
exports.authorizeManufacturer = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const manufacturer = await Manufacturer.findOne({ email });

    if (!manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found." });
    }

    if (manufacturer.isAuthorized) {
      return res.status(400).json({ message: "Manufacturer is already approved." });
    }

    manufacturer.isAuthorized = true;
    await manufacturer.save();

    res.status(200).json({ message: "Manufacturer approved successfully." });
  } catch (error) {
    console.error("🔥 Authorization Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch Pending Manufacturers
exports.fetchPendingManufacturers = async (req, res) => {
  try {
    const pendingManufacturers = await Manufacturer.find({ isAuthorized: false });
    res.status(200).json(pendingManufacturers);
  } catch (error) {
    console.error("🔥 Error fetching pending manufacturers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user by email
    let user = await Master.findOne({ email });
    if (!user) {
      user = await Manufacturer.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("🔥 Password Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};