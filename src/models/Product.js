// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: String,
//   price: { type: Number, required: true },
//   category: String,
//   stock: { type: Number, required: true },
//   imageUrl: String,
//   manufacturer: { 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User model
//     required: true 
//   }
// });

// module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, required: true },
  imageUrl: String,
  videoUrl: String, // ✅ New
  company: String,  // ✅ New
  size: String, 
  returnPolicy: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },    // ✅ New
  
  manufacturer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  location: { type: String, required: true } // <--- नवीन field
});

module.exports = mongoose.model('Product', productSchema);