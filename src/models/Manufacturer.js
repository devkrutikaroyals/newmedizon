// const mongoose = require("mongoose");

// const manufacturerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, default: "manufacturer" },
//   isAuthorized: { type: Boolean, default: false },
// }, { timestamps: true });

// module.exports = mongoose.model("Manufacturer", manufacturerSchema);

const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Required field
    email: { type: String, required: true, unique: true }, // Unique and required
    password: { type: String, required: true }, // Required field
    role: { type: String, default: "manufacturer" }, // Default role
    isAuthorized: { type: Boolean, default: false }, // Authorization status
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Manufacturer", manufacturerSchema);
