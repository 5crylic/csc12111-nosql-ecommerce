// config/cassandra.js
require('dotenv').config();
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_HOST],
  localDataCenter: 'datacenter1',
  keyspace: 'ecommerce',
});

const connectCassandra = () => {
  client.connect()
    .then(() => console.log('Cassandra connected'))
    .catch(err => console.log('Cassandra connection error:', err));
};

module.exports = { client, connect: connectCassandra };
