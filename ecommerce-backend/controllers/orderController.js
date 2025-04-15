const mysql = require('../config/mysql');
const mongoose = require('mongoose');
const redis = require('../config/redis');
const Order = require('../models/Order');
// const OrderItem = require('../models/OrderItem');

const checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1. Lấy giỏ hàng của người dùng từ Redis
    const cartKey = `cart:${userId}`;
    const cartItems = await redis.hgetall(cartKey);

    if (Object.keys(cartItems).length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng của bạn trống' });
    }

    // 2. Tính tổng giá trị đơn hàng
    let totalAmount = 0;
    const orderItems = [];
    for (const [productId, value] of Object.entries(cartItems)) {
      const item = JSON.parse(value);
      orderItems.push({ productId, quantity: item.quantity });
      totalAmount += item.quantity * 100; // Giả sử giá mỗi sản phẩm là 100
    }

    // 3. Lưu thông tin đơn hàng vào MySQL (orders và order_items)
    const [orderResult] = await mysql.query('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)', [userId, totalAmount]);
    const orderId = orderResult.insertId;

    for (const item of orderItems) {
      await mysql.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [
        orderId,
        item.productId,
        item.quantity,
        100, // Giả sử giá mỗi sản phẩm là 100
      ]);
    }

    // 4. Lưu thông tin đơn hàng vào MongoDB (archived_orders)
    const archivedOrder = new Order({
      orderId,
      userId,
      totalAmount,
      items: orderItems,
    });

    await archivedOrder.save();

    // 5. Xóa giỏ hàng khỏi Redis
    await redis.del(cartKey);

    res.status(200).json({ message: 'Đặt hàng thành công', orderId });
  } catch (err) {
    console.error('Lỗi khi đặt hàng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { checkout };
