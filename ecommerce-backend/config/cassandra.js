require('dotenv').config();
const cassandra = require('cassandra-driver');

const cassandraClient = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST],
  localDataCenter: 'datacenter1', 
  keyspace: 'ecommerce',
});

const connectCassandra = async () => {
  try {
    await cassandraClient.connect();
    console.log('✅ Cassandra connected');
  } catch (err) {
    console.error('❌ Cassandra connection error:', err);
  }

  // Optional: Log disconnect (driver tự động reconnect)
  cassandraClient.on('log', (level, className, message, furtherInfo) => {
    if (level === 'error') {
      console.warn(`⚠️ Cassandra warning: ${message}`);
    }
  });
};

module.exports = { cassandraClient, connect: connectCassandra };
