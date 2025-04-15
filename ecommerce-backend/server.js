const express = require('express');
const dotenv = require('dotenv');
const connectMongoDB = require('./config/mongo');
const mysql = require('./config/mysql'); // chỉ khởi tạo kết nối pool
const redis = require('./config/redis');

const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // để đọc JSON từ req.body

// Kết nối Database
connectMongoDB();
redis.on('connect', () => console.log('Connected to Redis'));
mysql.getConnection()
  .then(conn => {
    console.log('Connected to MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

// Routes
app.use('/users', userRoutes);          // POST /users
app.use('/cart', cartRoutes);           // POST /cart/:userId/add
app.use('/order', orderRoutes);         // POST /order/checkout
app.use('/product', reviewRoutes);      // POST /product/:id/review

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

