const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authSession = require('../middlewares/authSession');

router.post('/checkout', authSession, orderController.checkout);
router.get('/history', authSession, orderController.getOrderHistory);

module.exports = router;
