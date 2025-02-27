// const Manufacturer = require("../models/Manufacturer");

// // Get all manufacturers
// exports.getManufacturers = async (req, res) => {
//   try {
//     const manufacturers = await Manufacturer.find();
//     res.json(manufacturers);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Get manufacturer by ID
// exports.getManufacturerById = async (req, res) => {
//   try {
//     const manufacturer = await Manufacturer.findById(req.params.id);
//     if (!manufacturer) return res.status(404).json({ message: "Manufacturer not found" });

//     res.json(manufacturer);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Update manufacturer details
// exports.updateManufacturer = async (req, res) => {
//   try {
//     const manufacturer = await Manufacturer.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!manufacturer) return res.status(404).json({ message: "Manufacturer not found" });

//     res.json(manufacturer);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Delete manufacturer
// exports.deleteManufacturer = async (req, res) => {
//   try {
//     const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
//     if (!manufacturer) return res.status(404).json({ message: "Manufacturer not found" });

//     res.json({ message: "Manufacturer deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// src/controllers/manufacturerController.js

// const Manufacturer = require("../models/Manufacturer");
// const Product = require("../models/Product");
// const Order = require("../models/Order");
// const Shipment = require("../models/Shipment");
// const mongoose = require("mongoose");

// // Get all manufacturers
// exports.getManufacturers = async (req, res) => {
//     try {
//         const manufacturers = await Manufacturer.find();
//         res.status(200).json(manufacturers);
//     } catch (error) {
//         console.error("Error fetching manufacturers:", error.message);
//         res.status(500).json({ message: "Failed to fetch manufacturers." });
//     }
// };

// // Get products for a manufacturer
// exports.getProducts = async (req, res) => {
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

// // Get manufacturer by ID
// exports.getManufacturerById = async (req, res) => {
//     try {
//         const manufacturer = await Manufacturer.findById(req.params.id);
//         if (!manufacturer) {
//             return res.status(404).json({ message: "Manufacturer not found" });
//         }
//         res.json(manufacturer);
//     } catch (error) {
//         console.error("Error fetching manufacturer by ID:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// // Update manufacturer details
// exports.updateManufacturer = async (req, res) => {
//     try {
//         const manufacturer = await Manufacturer.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!manufacturer) {
//             return res.status(404).json({ message: "Manufacturer not found" });
//         }
//         res.json(manufacturer);
//     } catch (error) {
//         console.error("Error updating manufacturer:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// // Delete manufacturer
// exports.deleteManufacturer = async (req, res) => {
//     try {
//         const manufacturer = await Manufacturer.findByIdAndDelete(req.params.id);
//         if (!manufacturer) {
//             return res.status(404).json({ message: "Manufacturer not found" });
//         }
//         res.json({ message: "Manufacturer deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting manufacturer:", error.message);
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// // Fetch dashboard statistics
// exports.getDashboardStats = async (req, res) => {
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
// exports.getManufacturerProducts = async (req, res) => {
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


const Manufacturer = require("../models/Manufacturer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Shipment = require("../models/Shipment");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all manufacturers
exports.getManufacturers = async (req, res) => {
    try {
        const manufacturers = await Manufacturer.find();
        res.status(200).json(manufacturers);
    } catch (error) {
        console.error("Error fetching manufacturers:", error.message);
        res.status(500).json({ message: "Failed to fetch manufacturers." });
    }
};

// Get manufacturer by ID
exports.getManufacturerById = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Manufacturer ID." });
    }

    try {
        const manufacturer = await Manufacturer.findById(id);
        if (!manufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }
        res.status(200).json(manufacturer);
    } catch (error) {
        console.error("Error fetching manufacturer by ID:", error.message);
        res.status(500).json({ message: "Failed to fetch manufacturer." });
    }
};

// Update manufacturer details
exports.updateManufacturer = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Manufacturer ID." });
    }

    try {
        const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedManufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }
        res.status(200).json(updatedManufacturer);
    } catch (error) {
        console.error("Error updating manufacturer:", error.message);
        res.status(500).json({ message: "Failed to update manufacturer." });
    }
};

// Delete manufacturer
exports.deleteManufacturer = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid Manufacturer ID." });
    }

    try {
        const deletedManufacturer = await Manufacturer.findByIdAndDelete(id);
        if (!deletedManufacturer) {
            return res.status(404).json({ message: "Manufacturer not found" });
        }
        res.status(200).json({ message: "Manufacturer deleted successfully." });
    } catch (error) {
        console.error("Error deleting manufacturer:", error.message);
        res.status(500).json({ message: "Failed to delete manufacturer." });
    }
};
// Ensure proper exports
exports.getManufacturerProducts = async (req, res) => {
    const manufacturerId = req.user?.id;
    if (!manufacturerId || !mongoose.Types.ObjectId.isValid(manufacturerId)) {
        return res.status(400).json({ message: "Invalid or missing Manufacturer ID." });
    }

    try {
        const products = await Product.find({ manufacturerId });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ message: "Failed to fetch products." });
    }
};

exports.getDashboardStats = async (req, res) => {
    const manufacturerId = req.user?.id;
    if (!manufacturerId || !mongoose.Types.ObjectId.isValid(manufacturerId)) {
        return res.status(400).json({ message: "Invalid or missing Manufacturer ID." });
    }

    try {
        const totalProducts = await Product.countDocuments({ manufacturerId });
        res.status(200).json({ totalProducts });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error.message);
        res.status(500).json({ message: "Failed to fetch dashboard stats." });
    }
};
