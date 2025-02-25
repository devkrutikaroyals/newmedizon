const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  status: { type: String, default: "In Transit" },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Shipment", shipmentSchema);
