const { v4: uuidv4 } = require('uuid');
const cassandraClient = require('../config/cassandra');

exports.checkout = async (req, res) => {
  const userId = req.userId;
  const { address, paymentMethod } = req.body;

  const orderId = uuidv4();
  const orderDate = new Date();
  const status = 'pending';

  const items = cartItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity.toString(),
    price: item.price.toString()
  }));

  const cassandraItems = items.map(i => new Map(Object.entries(i)));

  try {
    const query = `INSERT INTO orders (userId, orderId, status, items, orderDate) VALUES (?, ?, ?, ?, ?)`;
    await cassandraClient.execute(query, [userId, orderId, status, cassandraItems, orderDate], { prepare: true });

    res.status(200).json({ orderId, status });
  } catch (err) {
    console.error('Cassandra Error:', err);
    res.status(500).json({ error: 'Could not create order' });
  }
};

exports.getOrderHistory = async (req, res) => {
  const userId = req.userId;

  try {
    const result = await cassandraClient.execute(
      `SELECT orderId, status, items, orderDate FROM orders WHERE userId = ?`,
      [userId],
      { prepare: true }
    );

    const history = result.rows.map(row => ({
      orderId: row.orderid,
      status: row.status,
      items: row.items.map(item => ({
        productId: item.get('productId'),
        quantity: parseInt(item.get('quantity')),
        price: parseInt(item.get('price'))
      })),
      orderDate: row.orderdate
    }));

    res.status(200).json(history);
  } catch (err) {
    console.error('Cassandra Error:', err);
    res.status(500).json({ error: 'Could not retrieve order history' });
  }
};
