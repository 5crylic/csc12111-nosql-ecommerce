const express = require('express');
const router = express.Router();
const authSession = require('../middlewares/authSession');
const reviewController = require('../controllers/reviewController');

router.post('/:productId', authSession, reviewController.postReview);
router.get('/:productId', reviewController.getReviews);
router.get('/userBehaviour', authSession, reviewController.getUserBehavior);

module.exports = router;
