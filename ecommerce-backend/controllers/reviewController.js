const Review = require('../models/Review');

const addReview = async (req, res) => {
  try {
    const { id: productId } = req.params;  // Lấy productId từ URL params
    const { userId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Đánh giá phải từ 1 đến 5 sao' });
    }

    const newReview = new Review({
      productId,
      userId,
      rating,
      comment
    });

    await newReview.save();

    res.status(201).json({ message: 'Đánh giá thành công', review: newReview });
  } catch (err) {
    console.error('Lỗi khi thêm đánh giá:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { addReview };
