require('dotenv').config();
const express = require('express');
const app = express();

// Body parser
app.use(express.json());

// Connect DBs
require('./config/mongo');
require('./config/redis');
require('./config/cassandra');
require('./config/neo4j');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/review', require('./routes/reviewRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
