require('dotenv').config();
const neo4j = require('neo4j-driver');

const NEO4J_URI = process.env.NEO4J_URI; // ví dụ: bolt://localhost:7687
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

const getSession = () => driver.session();

const connectNeo4j = async () => {
  try {
    // Gửi truy vấn test để xác nhận kết nối
    const session = driver.session();
    await session.run('RETURN 1');
    console.log('✅ Neo4j connected');
    await session.close();
  } catch (err) {
    console.error('❌ Neo4j connection error:', err);
  }

  // Optional: log disconnect
  driver.onCompleted = () => {
    console.warn('⚠️ Neo4j driver completed.');
  };
};

module.exports = {
  getSession,
  connect: connectNeo4j,
};
