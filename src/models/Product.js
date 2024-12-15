const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
  },
  description: { type: String },
  price: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  brand: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Brand', 
    required: true 
  },
  stock: { 
    type: Number,
     default: 0 
  }, // Tracks inventory
  images: [{ type: String }], // Array of image URLs
},
{timestamps:true}
);

module.exports = mongoose.model('Product', productSchema);
