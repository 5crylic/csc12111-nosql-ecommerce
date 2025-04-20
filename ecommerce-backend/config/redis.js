require('dotenv').config();
const redis = require('redis');

const redisURL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
const client = redis.createClient({ url: redisURL });

const connectRedis = async () => {
  try {
    await client.connect();
    console.log('✅ Redis connected');
  } catch (err) {
    console.error('❌ Redis connection error:', err);
  }

  // Optional: Log disconnects (không bắt buộc, nhưng hữu ích)
  client.on('end', () => {
    console.warn('⚠️ Redis disconnected');
  });
};

module.exports = { client, connect: connectRedis };
