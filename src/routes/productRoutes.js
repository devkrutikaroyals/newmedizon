
// const express = require("express");
// const multer = require("multer");
// const Product = require("../models/Product");
// const authenticate = require("../middleware/authMiddleware");
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// // Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// // Add Product Route
// router.post("/", authenticate, upload.single("imageFile"), async (req, res) => {
//   try {
//     let imageUrl = "";

//     if (req.file) {
//       const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//       const result = await cloudinary.uploader.upload(base64String);
//       imageUrl = result.secure_url;
//     }

//     const product = new Product({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       category: req.body.category,
//       stock: req.body.stock,
//       imageUrl: imageUrl,
//       manufacturer: req.user.id,
//     });

//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // Update Product Route
// router.put("/:id", authenticate, upload.single("imageFile"), async (req, res) => {
//   try {
//     let imageUrl = req.body.imageUrl;

//     if (req.file) {
//       const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//       const result = await cloudinary.uploader.upload(base64String);
//       imageUrl = result.secure_url;
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, imageUrl },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // Get Manufacturer's Products
// router.get("/manufacturer", authenticate, async (req, res) => {
//   try {
//     const products = await Product.find({ manufacturer: req.user.id });
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // Delete Product
// router.delete("/:id", authenticate, async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// module.exports = router;
 

const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const authenticate = require("../middleware/authMiddleware");
const cloudinary = require("cloudinary").v2;
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


/**
 * MANUFACTURER ROUTES
 * These endpoints assume the user is a manufacturer (role not equal to "master")
 */

// Get Manufacturer's Products
// router.get("/manufacturer", authenticate, async (req, res) => {
//   try {
//     // Optionally, you could also enforce that only non-master users call this endpoint
//     if (req.user.role === "master") {
//       return res.status(403).json({ message: "Master admin should use the master endpoint" });
//     }
//     const products = await Product.find({ manufacturer: req.user.id });
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching manufacturer products:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// });

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



// Add Product (for manufacturers; master admin can use a separate route if needed)
router.post("/", authenticate, upload.single("imageFile"), async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64String);
      imageUrl = result.secure_url;
    }

    // // Build product data
    // const productData = {
    //   name: req.body.name,
    //   description: req.body.description,
    //   price: req.body.price,
    //   category: req.body.category,
    //   stock: req.body.stock,
    //   imageUrl: imageUrl,
    // };


    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      imageUrl: imageUrl,
      location: req.body.location, // ✅ location field add केलंय इथे
    };

    
    // For manufacturers, bind the product to their account.
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
router.put("/:id", authenticate, upload.single("imageFile"), async (req, res) => {
  try {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
      const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(base64String);
      imageUrl = result.secure_url;
    }

    // Build a filter: If not master, ensure the product belongs to the manufacturer.
    const filter = { _id: req.params.id };
    if (req.user.role !== "master") {
      filter.manufacturer = req.user.id;
    }

    const updatedProduct = await Product.findOneAndUpdate(
      filter,
      { ...req.body, imageUrl },
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

module.exports = router;

 

// routes/product.js

// const express = require("express"); // Corrected 'requre' to 'require'
// const multer = require("multer");   // Corrected 'requirei' to 'require'


// const Product = require("../models/Product");

// const authenticate = require("../middleware/authMiddleware");
// const cloudinary = require("cloudinary").v2;
// require("dotenv").config();

// const router = express.Router();
// const upload = multer({ storage: multer.memoryStorage() });

// // 🌥️ Cloudinary Configuration
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
// });

// // 📊 Fetch Total Products
// const getTotalProducts = async (req, res) => {
//   try {
//     const totalProducts = await Product.countDocuments();
//     res.json({ totalProducts });
//   } catch (error) {
//     console.error("Error fetching total products:", error);
//     res.status(500).json({ message: "Failed to fetch total products" });
//   }
// };

// // This route uses getTotalProducts as a callback function
// router.get("/total-products", getTotalProducts);

// // 🟢 Add Product
// router.post("/", authenticate, upload.single("imageFile"), async (req, res) => {
//   try {
//     let imageUrl = "";

//     if (req.file) {
//       const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//       const result = await cloudinary.uploader.upload(base64String);
//       imageUrl = result.secure_url;
//     }

//     const product = new Product({
//       name: req.body.name,
//       description: req.body.description,
//       price: req.body.price,
//       category: req.body.category,
//       stock: req.body.stock,
//       imageUrl,
//       manufacturer: req.user.id,
//     });

//     await product.save();
//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(400).json({ message: error.message });
//   }
// });

// // ✏️ Update Product
// router.put("/:id", authenticate, upload.single("imageFile"), async (req, res) => {
//   try {
//     let imageUrl = req.body.imageUrl;

//     if (req.file) {
//       const base64String = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
//       const result = await cloudinary.uploader.upload(base64String);
//       imageUrl = result.secure_url;
//     }

//     const updatedProduct = await Product.findOneAndUpdate(
//       { _id: req.params.id, manufacturer: req.user.id },
//       { ...req.body, imageUrl },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ message: "Product not found or unauthorized" });
//     }

//     res.json(updatedProduct);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // 🔍 Get All Products
// router.get("/", authenticate, async (req, res) => {
//   try {
//     const products = await Product.find(); // Fetch all products for master dashboard
//     res.json(products);
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// // ❌ Delete Product
// router.delete("/:id", authenticate, async (req, res) => {
//   try {
//     const product = await Product.findOneAndDelete({ _id: req.params.id, manufacturer: req.user.id });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found or unauthorized" });
//     }
//     res.json({ message: "Product deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// module.exports = router;