const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../modules/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('campground/new');
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',     // Nested populate, or the author in reviews won't be displayed
        populate: 'author'   // 當使用populate的時候要思考資料的數量，若太多的話不可以一次全部populate
    }).populate('author');
    if( !campground ){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campground');
    }
    res.render('campground/show', { campground });
}))

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground({author: req.user._id, ...req.body.campground});
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${campground._id}`);
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campground/${id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}))

module.exports = router;