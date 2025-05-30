

const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const authenticate = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose');

require("dotenv").config();


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});





// This route uses getTotalProducts as a callback function
router.get("/list", authenticate, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

router.get("/all",  async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});


router.get("/manufacturer", authenticate, async (req, res) => {
  try {
    if (req.user.role === "master") {
      return res.status(403).json({ message: "Master admin should use the master endpoint" });
    }

    const totalProducts = await Product.countDocuments({ manufacturer: req.user.id });

    const products = await Product.find({ manufacturer: req.user.id });

    res.json({ totalProducts, products });
  } catch (error) {
    console.error("Error fetching manufacturer products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});




router.post("/", authenticate, upload.fields([{ name: "imageFile" }, { name: "videoFile" }]), async (req, res) => {
  try {
    let imageUrl = "";
    let videoUrl = "";

    if (req.files?.imageFile?.[0]) {
      const base64Image = `data:${req.files.imageFile[0].mimetype};base64,${req.files.imageFile[0].buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64Image);
      imageUrl = result.secure_url;
    }

    if (req.files?.videoFile?.[0]) {
      const base64Video = `data:${req.files.videoFile[0].mimetype};base64,${req.files.videoFile[0].buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64Video, { resource_type: "video" });
      videoUrl = result.secure_url;
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      imageUrl,
      videoUrl,
      location: req.body.location,
      company: req.body.company,
      size: req.body.size,
      returnPolicy: req.body.returnPolicy,
    };

    if (req.user.role !== "master") {
      productData.manufacturer = req.user.id;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(400).json({ message: error.message });
  }
});


// Update Product Route
router.put("/:id", authenticate, upload.fields([{ name: "imageFile" }, { name: "videoFile" }]), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    let videoUrl = req.body.videoUrl;

    // Check and upload new image if available
    if (req.files?.imageFile?.[0]) {
      const base64Image = `data:${req.files.imageFile[0].mimetype};base64,${req.files.imageFile[0].buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64Image);
      imageUrl = result.secure_url;
    }

    // Check and upload new video if available
    if (req.files?.videoFile?.[0]) {
      const base64Video = `data:${req.files.videoFile[0].mimetype};base64,${req.files.videoFile[0].buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64Video, { resource_type: "video" });
      videoUrl = result.secure_url;
    }

    // Build a filter: If not master, ensure the product belongs to the manufacturer.
    const filter = { _id: req.params.id };
    if (req.user.role !== "master") {
      filter.manufacturer = req.user.id;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { 
        ...req.body, 
        imageUrl,
        videoUrl,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


// Delete Product Route
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== "master") {
      filter.manufacturer = req.user.id;
    }
    const product = await Product.findOneAndDelete(filter);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



  


// In your products route (routes/products.js)
router.put('/update-stock/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the manufacturer is updating their own product
    if (req.user.role !== 'master' && product.manufacturer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const newStock = product.stock + req.body.quantity;
    if (newStock < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock = newStock;
    await product.save();

    res.json({ 
      success: true,
      message: 'Stock updated successfully',
      product 
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
module.exports = router;

 