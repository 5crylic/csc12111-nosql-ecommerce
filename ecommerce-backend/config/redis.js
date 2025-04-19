// config/redis.js
require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const connectRedis = () => {
  client.on('connect', () => {
    console.log('Connected to Redis');
  });
};

module.exports = { client, connect: connectRedis };
