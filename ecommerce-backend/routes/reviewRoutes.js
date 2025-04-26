const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authSession = require('../middlewares/authSession');
const reviewController = require('../controllers/reviewController');

router.post('/:productId', authMiddleware, reviewController.postReview);
router.get('/:productId', reviewController.getReviews);
router.get('/userBehaviour', authMiddleware, reviewController.getUserBehavior);

module.exports = router;
