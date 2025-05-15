const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const compression = require("compression");
const morgan = require("morgan");
const { createClient } = require('@supabase/supabase-js');

// Import middleware and routes
const errorHandler = require("./src/middleware/errorMiddleware");
const authRoutes = require("./src/routes/authRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const manufacturerRoutes = require("./src/routes/manufacturerRoutes");
const manufactureDashboard = require("./src/routes/manufacturerDashboard");
const masterDashboard = require("./src/routes/masterDashboard");
const itemRoutes = require("./src/routes/itemRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const shipmentRoutes = require("./src/routes/shipmentRoutes");

// Import models
const Product = require("./src/models/Product");
const Manufacturer = require("./src/models/Manufacturer");

// Load environment variables
dotenv.config();
require("dotenv").config();

// Initialize Express app
const app = express();



// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests from this IP, please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many login attempts, please try again later.",
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Apply rate limiting
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/master-panel", {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/manufacturers", manufacturerRoutes);
app.use("/api/manufacturer-dashboard", manufactureDashboard);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/master-dashboard", masterDashboard);

// Dashboard Counts
app.get("/api/total-products", async (req, res) => {
  try {
    const totalProducts = await Product.estimatedDocumentCount();
    res.status(200).json({ success: true, totalProducts });
  } catch (error) {
    console.error("❌ Error fetching product count:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch product count" });
  }
});

app.get("/api/total-manufacturers", async (req, res) => {
  try {
    const totalCompanies = await Manufacturer.estimatedDocumentCount();
    res.status(200).json({ success: true, totalCompanies });
  } catch (error) {
    console.error("❌ Error fetching company count:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch company count" });
  }
});

// Error handling
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 MongoDB connection closed");
  process.exit(0);
});