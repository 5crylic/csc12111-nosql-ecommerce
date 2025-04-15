const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  items: [{
    productId: String,
    quantity: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('ArchivedOrder', orderSchema);

module.exports = Order;
