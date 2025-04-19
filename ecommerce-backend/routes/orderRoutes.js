const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/checkout', verifyToken, orderController.checkout);
router.get('/history', verifyToken, orderController.getOrderHistory);

module.exports = router;
