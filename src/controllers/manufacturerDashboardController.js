// const mongoose = require("mongoose");
// const Product = require("../models/Product");
// const Order = require("../models/Order");
// const Shipment = require("../models/Shipment");

// // Fetch dashboard statistics
// const getDashboardStats = async (req, res) => {
//     try {
//         const manufacturerId = req.user?.id;

//         if (!manufacturerId || !mongoose.Types.ObjectId.isValid(manufacturerId)) {
//             return res.status(400).json({ message: "Invalid or missing Manufacturer ID." });
//         }

//         const [totalProducts, totalOrders, totalShipments] = await Promise.all([
//             Product.countDocuments({ manufacturerId }),
//             Order.countDocuments({ manufacturerId }),
//             Shipment.countDocuments({ manufacturerId }),
//         ]);

//         res.status(200).json({ totalProducts, totalOrders, totalShipments });
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error.message);
//         res.status(500).json({ message: "Failed to fetch dashboard data." });
//     }
// };

// // Fetch products for the manufacturer
// const getManufacturerProducts = async (req, res) => {
//     try {
//         const manufacturerId = req.user?.id;

//         if (!manufacturerId || !mongoose.Types.ObjectId.isValid(manufacturerId)) {
//             return res.status(400).json({ message: "Invalid or missing Manufacturer ID." });
//         }

//         const products = await Product.find({ manufacturerId });
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Error fetching products:", error.message);
//         res.status(500).json({ message: "Failed to fetch products." });
//     }
// };

// // Export the functions
// module.exports = {
//     getDashboardStats,
//     getManufacturerProducts,
// };

const Manufacturer = require("../models/Manufacturer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Shipment = require("../models/Shipment");
const mongoose = require("mongoose");

// exports.getDashboardStats = async (req, res) => {
//     try {
//         // Count total manufacturers
//         const totalManufacturers = await Manufacturer.countDocuments();

//         // Count other statistics
//         const manufacturerId = req.manufacturer.id;
//         if (!manufacturerId || !mongoose.Types.ObjectId.isValid(manufacturerId)) {
//             return res.status(400).json({ message: "Invalid or missing Manufacturer ID." });
//         }

//         const [totalProducts, totalOrders, totalShipments] = await Promise.all([
//             Product.countDocuments({ manufacturerId }),
//             Order.countDocuments({ manufacturerId }),
//             Shipment.countDocuments({ manufacturerId }),
//         ]);

//         res.status(200).json({
//              // Corrected this line
//             totalProducts,
//             totalOrders,
//             totalShipments,
//         });
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error.message);
//         res.status(500).json({ message: "Failed to fetch dashboard data." });
//     }
// };
exports.getDashboardStats = async (req, res) => {
    try {
        // Ensure manufacturerId is valid
        const manufacturerId = req.manufacturer.id;
        if (!manufacturerId || !mongoose.Types.ObjectId.isValid(manufacturerId)) {
            return res.status(400).json({ message: "Invalid or missing Manufacturer ID." });
        }

        // Count total products for the specific manufacturer
        const totalProducts = await Product.countDocuments({ manufacturerId });

        res.status(200).json({ totalProducts });
    } catch (error) {
        console.error("Error fetching total products:", error.message);
        res.status(500).json({ message: "Failed to fetch total products." });
    }
};

