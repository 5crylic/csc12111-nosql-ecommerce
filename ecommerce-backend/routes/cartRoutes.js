const express = require('express');
const router = express.Router();
const authSession = require('../middlewares/authSession');
const cartController = require('../controllers/cartController');

router.post('/add', authSession, cartController.addToCart);
router.get('/', authSession, cartController.getCart);
router.delete('/remove/:id', authSession, cartController.removeFromCart);

module.exports = router;
