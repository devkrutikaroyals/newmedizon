const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, required: true },
  imageUrl: String,
  manufacturer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true 
  }
});

module.exports = mongoose.model('Product', productSchema);