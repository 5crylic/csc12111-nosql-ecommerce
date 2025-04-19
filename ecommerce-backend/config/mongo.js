// config/mongo.js
require('dotenv').config();
const mongoose = require('mongoose');

const connectMongoDB = () => {
  const mongoURI = process.env.MONGO_URI;
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.log('MongoDB connection error:', err);
  });
};

module.exports = connectMongoDB;
