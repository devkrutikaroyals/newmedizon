const express = require("express");
const router = express.Router();
const masterDashboardController = require("../controllers/masterDashboardController");

// 📊 Dashboard Routes
router.get("/total-products", masterDashboardController.getTotalProducts);
router.get("/total-manufacturers", masterDashboardController.getTotalManufacturers); // Updated route
router.get("/all-items", masterDashboardController.getAllProducts);
router.get("/all-items-by-category", masterDashboardController.getAllCategories);

// 🛍️ Product Routes for Master Dashboard
router.get("/products", masterDashboardController.getProducts);
router.post("/products", masterDashboardController.addProduct);
router.get("/products/:id", masterDashboardController.getProductById);
router.put("/products/:id", masterDashboardController.updateProduct);
router.delete("/products/:id", masterDashboardController.deleteProduct);

module.exports = router;
