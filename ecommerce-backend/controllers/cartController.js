const { client } = require('../config/redis');
const Product = require('../models/mongo/Product');

exports.addToCart = async (req, res) => {
  const { productId, quantity, variant } = req.body;
  const userId = req.userId;

  if (!productId || !quantity || !variant) {
    return res.status(400).json({ error: 'Missing product info' });
  }

  const cartKey = `cart:${userId}`;

  try {
    const rawItems = await client.lRange(cartKey, 0, -1);
    let isUpdated = false;

    for (let i = 0; i < rawItems.length; i++) {
      const item = JSON.parse(rawItems[i]);

      if (
        item.productId === productId &&
        item.variant.color === variant.color &&
        item.variant.size === variant.size
      ) {
        item.quantity += quantity;
        await client.lSet(cartKey, i, JSON.stringify(item));
        isUpdated = true;
        break;
      }
    }

    if (!isUpdated) {
      const cartItem = JSON.stringify({ productId, quantity, variant });
      await client.rPush(cartKey, cartItem);
    }

    res.json({ message: 'Product added to cart successfully' });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};


exports.getCart = async (req, res) => {
  const userId = req.userId;
  const cartKey = `cart:${userId}`;

  try {
    const rawItems = await client.lRange(cartKey, 0, -1);
    const items = [];

    let total = 0;

    for (const item of rawItems) {
      const parsed = JSON.parse(item);
      const product = await Product.findById(parsed.productId);

      if (product) {
        const itemTotal = product.price * parsed.quantity;
        total += itemTotal;

        items.push({
          productId: parsed.productId,
          quantity: parsed.quantity,
          variant: parsed.variant,
          price: product.price
        });
      }
    }

    res.json({ items, total });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.userId;
  const productIdToRemove = req.params.id;
  const cartKey = `cart:${userId}`;
  let isProductIdFound = false 
  try {
    const rawItems = await client.lRange(cartKey, 0, -1);
    for (const item of rawItems) {
      const parsed = JSON.parse(item);
      if (parsed.productId === productIdToRemove) {
        await client.lRem(cartKey, 1, item);
        isProductIdFound = true;
        break;
      }
    }

    if (!isProductIdFound) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    res.json({ message: 'Product removed from cart' });
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};
