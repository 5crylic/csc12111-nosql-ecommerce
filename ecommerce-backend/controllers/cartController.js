const redis = require('../config/redis');

const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Sản phẩm và số lượng là bắt buộc' });
    }

    // Lưu giỏ hàng vào Redis dưới dạng Hash
    const cartKey = `cart:${userId}`;
    const cartItem = {
      productId,
      quantity
    };

    // Lưu hoặc cập nhật sản phẩm trong giỏ
    await redis.hset(cartKey, productId, JSON.stringify(cartItem));

    res.status(200).json({ message: 'Đã thêm sản phẩm vào giỏ hàng', cartItem });
  } catch (err) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { addToCart };
