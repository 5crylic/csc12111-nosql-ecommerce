const User = require('../models/mongo/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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



// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('🟡 Login request received:', { email });

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.warn('🔴 No user found with email:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('👤 Found user:', user);

    if (!user.password) {
      console.warn('🔴 User found but password is missing');
      return res.status(500).json({ error: 'User data invalid' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn('🔴 Password mismatch for user:', email);
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error('❌ JWT_SECRET is missing in environment variables!');
      return res.status(500).json({ error: 'Server config error' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    console.log('🟢 Login successful for:', email);
    res.status(200).json({ token });
  } catch (error) {
    console.error('💥 Login Error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

// Get user info
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
