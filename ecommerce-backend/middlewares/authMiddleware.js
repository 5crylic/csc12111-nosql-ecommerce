const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const sessionId = decoded.sessionId;

    const redisKey = `session:${sessionId}`;
    const sessionData = await redisClient.hGetAll(redisKey);

    if (!sessionData || !sessionData.token || sessionData.token !== token) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.userId = sessionData.user_id;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
