const express = require('express');
const router = express.Router({ mergeParams: true }); // Some get.params are included in app.js route, we need to add mergeParams
const catchAsync = require('../utils/catchAsync');
const Campground = require('../modules/campground');
const Review = require('../modules/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review({author: req.user._id, ...req.body.review});
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Create a review!');
    res.redirect(`/campground/${req.params.id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    req.flash('success', 'Delete a review!');
    res.redirect(`/campground/${id}`);
}))

module.exports = router;