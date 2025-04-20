const User = require('../models/mongo/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { client: redisClient } = require('../config/redis');
const { v4: uuidv4 } = require('uuid');

// Register
exports.register = async (req, res) => {
  const { email, password, name, phoneNumber } = req.body;

  try {
    console.log('🟢 Register input:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, name, phoneNumber });

    // Sử dụng try-catch để log lỗi khi lưu vào MongoDB
    try {
      await newUser.save();
      console.log('✅ User registered:', newUser.email);
      res.status(200).json({ message: 'User registered successfully' });
    } catch (dbError) {
      console.error('💥 Database save error:', dbError);
      res.status(500).json({ error: dbError.message || 'Database save error' });
    }

  } catch (error) {
    console.error('💥 Register Error:', error);  // In ra toàn bộ lỗi
    res.status(500).json({ error: error.message || 'Server error' });  // Trả về chi tiết lỗi
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('🟡 Login request received:', { email });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const sessionId = uuidv4();
    const tokenExpireSeconds = 7 * 24 * 60 * 60; // 7 ngày

    const token = jwt.sign(
      { sessionId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: tokenExpireSeconds }
    );

    // Lưu vào Redis: user_id + token
    const redisKey = `session:${sessionId}`;
    await redisClient.hSet(redisKey, {
      user_id: user._id.toString(),
      token,
    });

    await redisClient.expire(redisKey, tokenExpireSeconds);

    console.log(`🟢 Redis session created: ${redisKey}`);

    res.status(200).json({ token });
  } catch (error) {
    console.error('💥 Login Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Get user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

