const Campground = require('../modules/campground');
const Review = require('../modules/review');

module.exports.createReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review({author: req.user._id, ...req.body.review});
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Create a review!');
    res.redirect(`/campground/${req.params.id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndRemove(reviewId);
    req.flash('success', 'Delete a review!');
    res.redirect(`/campground/${id}`);
}

