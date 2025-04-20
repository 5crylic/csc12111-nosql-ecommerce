const Product = require('../models/mongo/Product');

// GET all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}, 'name price category stockQuantity image status');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(200).json({
      productId: product._id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      variants: product.variants,
      stockQuantity: product.stockQuantity,
      status: product.status,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
