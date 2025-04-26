require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const helmet = require('helmet');
const morgan = require('morgan');
const connectMongoDB = require('./config/mongo');
const { connect: connectRedis } = require('./config/redis');
const { connect: connectNeo4j } = require('./config/neo4j');
const { connect: connectCassandra } = require('./config/cassandra');


const app = express();

// Body parser
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Connect DBs
require('./config/mongo');
require('./config/redis');
require('./config/cassandra');
require('./config/neo4j');

connectMongoDB();
connectRedis();
connectNeo4j();
connectCassandra();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/review', require('./routes/reviewRoutes'));

app.get('/', (req, res) => {
  console.log('🟢 / route hit'
  )
  res.send('Welcome to the E-commerce API!');
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
