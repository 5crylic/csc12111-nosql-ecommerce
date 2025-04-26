const express = require('express');
const router = express.Router();
const authSession = require('../middlewares/authSession');
const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

router.post('/add', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/remove/:id', authMiddleware, cartController.removeFromCart);

module.exports = router;
