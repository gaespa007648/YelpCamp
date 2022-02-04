const express = require('express');
const router = express.Router({ mergeParams: true }); // Some get.params are included in app.js route, we need to add mergeParams
const catchAsync = require('../utils/catchAsync');
const reviewController = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;