const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticate;

// middleware/authMiddleware.js
// backend/middleware/authMiddleware.js
// const jwt = require("jsonwebtoken");

// const authenticate = async (req, res, next) => {
//     const token = req.header("Authorization")?.split(" ")[1];

//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         if (!req.user) {
//             return res.status(404).json({ message: "User not found." });
//         }
//         next();
//     } catch (error) {
//         console.error("Token verification failed:", error);
//         res.status(401).json({ message: "Invalid token." });
//     }
// };

// module.exports = authenticate;
