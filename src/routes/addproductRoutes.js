const express = require("express");
const multer = require("multer");
const Item = require("../models/Item");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/items", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, description, price, category, stock, manufacturer } = req.body;
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "uploads",
      });
      imageUrl = result.secure_url;
    }

    const newItem = new Item({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      manufacturer,
      userId: req.userId,
    });

    await newItem.save();
    res.status(201).json({ message: "Product added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

module.exports = router;