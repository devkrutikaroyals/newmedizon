const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "Manufacturer", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);