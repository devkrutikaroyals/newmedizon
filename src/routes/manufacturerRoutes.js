// const express = require("express");
// const { getMasters, createMaster } = require("../controllers/masterController");
// const { getPendingManufacturers } = require("../controllers/manufacturerController");
// const authMiddleware = require("../middleware/authMiddleware");
// const roleMiddleware = require("../middleware/roleMiddleware");
// const Product = require("../models/Product");
// const Shipment = require("../models/Shipment");
// const Order = require("../models/Order");

// const router = express.Router();

// // Master routes (Only accessible by master users)
// router.get("/masters", authMiddleware, roleMiddleware(["master"]), getMasters);
// router.post("/masters", authMiddleware, roleMiddleware(["master"]), createMaster);

// // Manufacturer routes
// router.get("/pending-manufacturers", getPendingManufacturers);
// // backend/routes/manufacturerRoutes.js
// // Dashboard counts endpoint
// router.get("/dashboard/counts", authenticate, async (req, res) => {
//     try {
//         const totalProducts = await Product.countDocuments({ manufacturerId: req.user.id });
//         const totalShipments = await Shipment.countDocuments({ manufacturerId: req.user.id });
//         const totalOrders = await Order.countDocuments({ manufacturerId: req.user.id });
       
        

//         res.json({
//             totalProducts,
//             totalShipments,
//             totalOrders,
            
//         });
//     } catch (error) {
//         console.error("Error fetching dashboard counts:", error.message);
//         res.status(500).json({ message: "Failed to fetch dashboard counts." });
//     }
// });

// router.get("/dashboard/products", manufacturerController.getProducts);
// router.get("/dashboard/shipments", manufacturerController.getShipments);
// router.get("/dashboard/orders", manufacturerController.getOrders); 
// module.exports = router;

// routes/manufacturerRoutes.js

// const express = require("express");
// const ManufacturerController = require("../controllers/manufacturerController");
// const router = express.Router();

// router.get("/", ManufacturerController.getManufacturers);
// router.get("/:id", ManufacturerController.getManufacturerById);
// router.put("/:id", ManufacturerController.updateManufacturer);
// router.delete("/:id", ManufacturerController.deleteManufacturer);

// module.exports = router;

// src/routes/manufacturerRoutes.js
// manufacturerRoutes.js
// const express = require("express");
// const ManufacturerController = require("../controllers/manufacturerController");
// const router = express.Router();

// // Manufacturer CRUD endpoints
// router.get("/", ManufacturerController.getManufacturers);
// router.get("/:id", ManufacturerController.getManufacturerById);
// router.put("/:id", ManufacturerController.updateManufacturer);
// router.delete("/:id", ManufacturerController.deleteManufacturer);

// module.exports = router;

const express = require("express");
const ManufacturerController = require("../controllers/manufacturerController");
const router = express.Router();

// Manufacturer CRUD endpoints
router.get("/", ManufacturerController.getManufacturers);
router.get("/:id", ManufacturerController.getManufacturerById);
router.put("/:id", ManufacturerController.updateManufacturer);
router.delete("/:id", ManufacturerController.deleteManufacturer);

// Additional endpoints
router.get("/products", ManufacturerController.getManufacturerProducts);
router.get("/dashboard/stats", ManufacturerController.getDashboardStats);

module.exports = router;
