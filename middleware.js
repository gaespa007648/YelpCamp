const { campgroundSchema, reviewSchema } = require('./checkSchema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./modules/campground');
const Review = require('./modules/review');

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in.');
        return res.redirect('/login');
    }
    next();
}

// Set the middleware the verify campground data.
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); // StatusCode=400 means bad request
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if( !campground ){
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    if( !campground.author.equals(req.user._id) ){
        req.flash('error', 'You don\'t have permission to do that');
        return res.redirect(`/campground/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if( !review ){
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    if( !review.author.equals(req.user._id) ){
        req.flash('error', 'You don\'t have permission to do that');
        return res.redirect(`/campground/${id}`);
    }
    next();
}

// Set the middleware to verify review data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); // StatusCode=400 means bad request
    } else {
        next();
    }
}