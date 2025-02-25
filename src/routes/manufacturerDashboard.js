// // routes/stats.js
// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const Order = require("../models/Order");
// const Shipment = require("../models/Shipment");
// const authenticate = require("../middleware/authMiddleware");

// // Get manufacturer dashboard counts
// router.get("/counts", authenticate, async (req, res) => {
//   try {
//     const manufacturerId = req.user.id;

//     const totalProducts = await Product.countDocuments({ manufacturer: manufacturerId });
//     const totalOrders = await Order.countDocuments({ manufacturer: manufacturerId });
//     const totalShipments = await Shipment.countDocuments({ manufacturer: manufacturerId });

//     res.json({ totalProducts, totalOrders, totalShipments });
//   } catch (error) {
//     console.error("Error fetching manufacturer counts:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



// routes/stats.js
// backend/routes/manufacturerRoutes.js



// const express = require("express");
// const router = express.Router();
// const authenticate = require("../middleware/authMiddleware");
// const Product = require("../models/Product");
// const Shipment = require("../models/Shipment");
// const Order = require("../models/Order");


// // Get total products
// router.get("/dashboard/products", authenticate, async (req, res) => {
//     try {
//         const totalProducts = await Product.countDocuments({ manufacturerId: req.user.id });
//         res.json({ totalProducts });
//     } catch (error) {
//         console.error("Error fetching products:", error.message);
//         res.status(500).json({ message: "Failed to fetch products." });
//     }
// });

// // Get total shipments
// router.get("/dashboard/shipments", authenticate, async (req, res) => {
//     try {
//         const totalShipments = await Shipment.countDocuments({ manufacturerId: req.user.id });
//         res.json({ totalShipments });
//     } catch (error) {
//         console.error("Error fetching shipments:", error.message);
//         res.status(500).json({ message: "Failed to fetch shipments." });
//     }
// });

// // Get total orders
// router.get("/dashboard/orders", authenticate, async (req, res) => {
//     try {
//         const totalOrders = await Order.countDocuments({ manufacturerId: req.user.id });
//         res.json({ totalOrders });
//     } catch (error) {
//         console.error("Error fetching orders:", error.message);
//         res.status(500).json({ message: "Failed to fetch orders." });
//     }
// });

// module.exports = router;
// src/routes/manufacturerDashboard.js
// src/routes/manufacturerDashboard.js
// manufacturerDashboardRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardStats, getManufacturerProducts } = require("../controllers/manufacturerController");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/products", authMiddleware, getManufacturerProducts);

module.exports = router;
