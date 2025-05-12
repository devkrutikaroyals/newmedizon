// const Product = require('../models/Product'); // Ensure you have a Product model

// // Add Product
// const addProduct = async (req, res) => {
//   try {
//     const product = new Product({ ...req.body, manufacturer: req.user.id });
//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// // Other product functions (update, delete, etc.) can be added here

// module.exports = {
//   addProduct,
//   // other exports
// };
// 




const Product = require("../models/Product");

// 📊 Get Total Products
exports.getTotalProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.json({ totalProducts: count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// 📌 Add Product (Master Admin - no manufacturer binding)
exports.addProduct = async (req, res) => {
  try {
    // For Master, we are using all fields from the request body.
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📌 Get All Products (For Master Admin)
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch all products without filtering by manufacturer.
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// 📌 Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// 📌 Update Product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// 📌 Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
// 📌 Get Single Product by ID
