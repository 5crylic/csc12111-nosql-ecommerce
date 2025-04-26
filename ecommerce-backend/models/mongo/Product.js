const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
  price: Number,
  discountPrice: Number,
  category: String,
  variants: [variantSchema],
  stockQuantity: Number,
  status: { type: String, enum: ['available', 'out of stock'], default: 'available' }
});

module.exports = mongoose.model('Product', productSchema);
