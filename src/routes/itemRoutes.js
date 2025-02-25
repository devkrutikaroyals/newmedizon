const express = require("express");
const multer = require("multer");
const { addItem, updateItem, deleteItem, getItems } = require("../controllers/itemController");
const authenticate = require("../middleware/authMiddleware");
const Item = require("../models/Item"); // Ensure you have an Item model

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Item Routes

// Add Item
router.post("/items", authenticate, upload.single("imageFile"), addItem);

// Update Item
router.put("/items/:id", authenticate, upload.single("imageFile"), updateItem);

// Delete Item
router.delete("/items/:id", authenticate, deleteItem);

// Fetch Items
router.get("/items", authenticate, async (req, res) => {
    try {
        const items = await Item.find({ userId: req.user.id }); // Ensure userId is being set correctly in request
        res.status(200).json({ items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ message: "An error occurred while fetching items" });
    }
});

module.exports = router;