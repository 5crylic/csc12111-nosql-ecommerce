const User = require('../models/User');

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Tên và email là bắt buộc' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: 'Tạo người dùng thành công', user: newUser });
  } catch (err) {
    console.error('Lỗi khi tạo user:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = { createUser };
