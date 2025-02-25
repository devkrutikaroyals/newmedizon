const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "master" },
});

module.exports = mongoose.model("Master", masterSchema);