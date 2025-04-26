const { getSession } = require('../config/neo4j');

exports.postReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.userId;

  if (!rating || rating < 1 || rating > 5 || typeof comment !== 'string') {
    return res.status(400).json({ error: 'Invalid rating or comment' });
  }

  const session = getSession();
  try {
    await session.run(
      `
      MERGE (u:User {userId: $userId})
      MERGE (p:Product {productId: $productId})
      MERGE (u)-[r:REVIEWED]->(p)
      SET r.rating = $rating, r.comment = $comment
      `,
      { userId, productId, rating, comment }
    );
    res.json({ message: 'Review added successfully' });
  } catch (err) {
    console.error('Neo4j Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
};

exports.getReviews = async (req, res) => {
  const { productId } = req.params;
  const session = getSession();

  try {
    const result = await session.run(
      `
      MATCH (u:User)-[r:REVIEWED]->(p:Product {productId: $productId})
      RETURN u.userId AS userId, r.rating AS rating, r.comment AS comment
      `,
      { productId }
    );

    const reviews = result.records.map(record => ({
      userId: record.get('userId'),
      rating: record.get('rating'),
      comment: record.get('comment'),
    }));

    res.json(reviews);
  } catch (err) {
    console.error('Neo4j Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
};

exports.getUserBehavior = async (req, res) => {
  const userId = req.userId;
  const session = getSession();
  try {
    const result = await session.run(
      `
      MATCH (u:User {userId: $userId})-[r:REVIEWED]->(p:Product)
      RETURN p.productId AS productId, p.name AS name, r.rating AS rating
      `,
      { userId }
    );

    const purchasedProducts = result.records.map(record => ({
      productId: record.get('productId'),
      name: record.get('name') || 'Unknown', // fallback nếu thiếu name
      rating: record.get('rating'),
    }));

    res.json({ purchasedProducts });
  } catch (err) {
    console.error('Neo4j Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await session.close();
  }
};
