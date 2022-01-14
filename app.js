const express = require('express');
const mongoose = require('mongoose');
const Review = require('./modules/review');
const Campground = require('./modules/campground');
const path = require('path');
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const {campgroundSchema, reviewSchema} = require('./checkSchema');

mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log('Success in connection!');
    })
    .catch(err => {
        console.log('Fail in connection!');
        console.log(err);
    })

const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Set the middleware the verify campground data.
const validateCampground = (req, res, next)=>{
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); // StatusCode=400 means bad request
    }else{
        next();
    }
}

// Set the middleware to verify review data
const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400); // StatusCode=400 means bad request
    }else{
        next();
    }
}

app.get('/campground', catchAsync( async(req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
}))

app.get('/campground/new', catchAsync( async(req, res)=>{
    res.render('campground/new');
}))

app.get('/campground/:id', catchAsync( async(req, res, next)=>{
    let campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campground/show', {campground});
}))

app.get('/campground/:id/edit', catchAsync( async(req, res, next)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', { campground });
}))

app.post('/campground/:id/reviews', validateReview, catchAsync( async(req, res, next)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campground/${req.params.id}`);
}))

app.post('/campground', validateCampground, catchAsync( async(req, res, next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
}))

app.put('/campground/:id', validateCampground, catchAsync( async(req, res, next)=>{
    const id = req.params.id;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campground/${id}`);
}))

app.delete('/campground/:id', catchAsync( async(req, res, next)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}))

app.delete('/campground/:id/reviews/:reviewId', catchAsync( async(req, res, next)=>{
    const {id, reviewId} = req.params;
    await Campground.findOneAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndRemove(reviewId);
    res.redirect(`/campground/${id}`);
}))

// If the website url doesn't match any app, it will run this function
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404));
})

// Error handler, we can design how to handle errors
app.use((err, req, res, next)=>{
    const { statusCode=500 } = err;
    if(!err.message){
        err.message = "Something went wrong";
    }
    res.status(statusCode).render('partial/error', { err });
})


app.listen('3000', ()=>{
    console.log('Listening on port 3000...');
})