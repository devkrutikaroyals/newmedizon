

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


router.post("/place-order", async (req, res) => {
  const { items, customerInfo, paymentInfo } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Validate all items first
    const stockValidation = await axios.post(
      "https://newmedizon.onrender.com/api/products/validate-stock",
      { items }
    );

    if (!stockValidation.data.valid) {
      return res.status(400).json({ 
        message: "Stock validation failed",
        results: stockValidation.data.results
      });
    }

    // 2. Deduct stock for each item
    const productUpdates = [];
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product_id).session(session);
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      // Update stock
      product.stock -= item.quantity;
      await product.save({ session });

      orderItems.push({
        product_id: product._id.toString(), // Ensure we use string ID
        product_name: product.name,
        quantity: item.quantity,
        unit_price: product.price,
        subtotal: product.price * item.quantity
      });

      totalAmount += product.price * item.quantity;
    }

    // 3. Create order in Supabase
    const orderData = {
      email: customerInfo.email,
      full_name: customerInfo.name,
      contact_number: customerInfo.phone || '',
      total_amount: totalAmount,
      payment_method: paymentInfo?.method || 'unknown',
      status: 'pending',
      address_line1: customerInfo.address?.line1 || '',
      landmark: customerInfo.address?.landmark || '',
      pin_code: customerInfo.address?.postalCode || '',
      items: orderItems,
      created_at: new Date().toISOString()
    };

    const { data: supabaseOrder, error: supabaseError } = await supabase
      .from('product_order')
      .insert(orderData)
      .select()
      .single();

    if (supabaseError) throw supabaseError;

    // Commit transaction if everything succeeds
    await session.commitTransaction();
    
    res.status(200).json({ 
      message: "Order placed successfully",
      orderId: supabaseOrder.id,
      totalAmount 
    });

  } catch (error) {
    await session.abortTransaction();
    console.error("Order processing error:", error);
    res.status(500).json({ 
      message: "Error processing order", 
      error: error.message 
    });
  } finally {
    session.endSession();
  }
});
 // Update product stock
router.put("/:id/stock", async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure stock doesn't go negative
    const newStock = product.stock + Number(quantity);
    if (newStock < 0) {
      return res.status(400).json({ 
        message: `Insufficient stock. Current stock: ${product.stock}`
      });
    }

    product.stock = newStock;
    await product.save();

    res.json({ 
      success: true,
      message: "Stock updated successfully",
      product 
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ 
      message: "Error updating stock", 
      error: error.message 
    });
  }
}); 
// Add this to your backend routes
router.post("/validate-stock", async (req, res) => {
  const { items } = req.body;
  
  if (!Array.isArray(items)) {
    return res.status(400).json({ message: "Items must be an array" });
  }
  
  try {
    const results = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return { 
            product_id: item.product_id,
            valid: false,
            message: "Product not found"
          };
        }
        return {
          product_id: item.product_id,
          product_name: product.name,
          requested: item.quantity,
          available: product.stock,
          valid: product.stock >= item.quantity
        };
      })
    );
    
    const allValid = results.every(item => item.valid);
    res.json({ valid: allValid, results });
  } catch (error) {
    res.status(500).json({ message: "Validation error", error: error.message });
  }
}); 

module.exports = router;

 
  