const { client } = require('../config/redis');

const authSession = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing session token' });
  }

  const sessionId = authHeader.split(' ')[1];
  const sessionKey = `session:${sessionId}`;

  try {
    const sessionData = await client.hGetAll(sessionKey) 
    if (!sessionData) {
      return res.status(401).json({ error: 'Session not found or expired' });
    }
    
    req.userId = sessionData.user_id;
    req.token = sessionData.token;
    req.sessionId = sessionId;

      console.log('Session Data:', { ... sessionData} );
    next();
  } catch (err) {
    console.error('AuthSession Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authSession;
