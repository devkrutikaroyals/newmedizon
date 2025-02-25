const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

module.exports = mongoose.model("Category", CategorySchema);
