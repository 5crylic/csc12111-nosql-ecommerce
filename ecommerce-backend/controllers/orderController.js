const { v4: uuidv4 } = require('uuid');
const { cassandraClient } = require('../config/cassandra');
const { client } = require('../config/redis');
const Product = require('../models/mongo/Product'); 

exports.checkout = async (req, res) => {
  const userId = req.userId;
  const { address, paymentMethod } = req.body;

  const orderId = uuidv4();
  const orderDate = new Date();
  const status = 'completed';

  const cartKey = `cart:${userId}`;
  
  const cartItems = await client.lRange(cartKey, 0, -1);

  const items = []


  for (let i = 0; i < cartItems.length; i++) {
        const item = JSON.parse(cartItems[i]);
        //delete(item.variant)
        item.quantity = item.quantity.toString()
        delete(item.variant)
        items.push(item)
        
      }


  ///const cassandraItems = items.map(i => new Map(Object.entries(i)));
  const cassandraItems = items.map(i => ({ ...i }));



  try {
    const query = `INSERT INTO orders (userId, orderId, status, items, orderDate) VALUES (?, ?, ?, ?, ?)`;
    await cassandraClient.execute(query, [userId, orderId, status, cassandraItems, orderDate], { prepare: true });

    res.status(200).json({ orderId, status });

    const redisKey = `cart:${userId}`;
    await client.del(redisKey);
    console.log(`🟢 Cart for user ${userId} deleted from Redis`);

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

    // Lấy hết productId từ tất cả các items
    const productIds = [];
    result.rows.forEach(row => {
      row.items.forEach(item => {
        if (item['productId']) {
          productIds.push(item['productId']);
        }
      });
    });

    // Truy vấn 1 lần lấy hết tất cả productId liên quan (giảm số lần gọi DB)
    const products = []

    for (let i = 0; i < productIds.length; i++) {
      
      const productId = productIds[i];
      const product = await Product.findById(productId);
      if (product) {
        products.push(product);
      }
    }
    // Map nhanh productId => productName
    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p.name;
    });

 console.log(productMap)

    const history = result.rows.map(row => ({
      orderId: row.orderid,
      status: row.status,
      items: row.items.map(item => ({
        //productId: item['productId'],
        productName: productMap[item.productId] || 'Unknown Product',
        quantity: parseInt(item['quantity']),
        price: parseInt(item['price'])
      })),
      orderDate: row.orderdate
    }));

    res.status(200).json(history);
  } catch (err) {
    console.error('Cassandra Error:', err);
    res.status(500).json({ error: 'Could not retrieve order history' });
  }
};
