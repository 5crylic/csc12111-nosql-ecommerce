const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/:productId', reviewController.createReview);
router.get('/:productId', reviewController.getProductReviews);
router.get('/behavior/:userId', reviewController.getUserBehavior);

module.exports = router;
