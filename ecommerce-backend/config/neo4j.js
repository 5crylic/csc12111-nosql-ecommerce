// config/neo4j.js
require('dotenv').config();
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const connectNeo4j = () => {
  const session = driver.session();
  session.run('MATCH (n) RETURN n LIMIT 25')
    .then(result => console.log('Connected to Neo4j:', result.records))
    .catch(err => console.log('Neo4j connection error:', err))
    .finally(() => session.close());
};

module.exports = { driver, connect: connectNeo4j };
