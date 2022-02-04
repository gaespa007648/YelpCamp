const Campground = require('../modules/campground');

module.exports.newCampground = async (req, res) => {
    res.render('campground/new');
}

module.exports.displayCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',     // Nested populate, or the author in reviews won't be displayed
        populate: 'author'   // 當使用populate的時候要思考資料的數量，若太多的話不可以一次全部populate
    }).populate('author');
    if( !campground ){
        req.flash('error', 'Cannot find the campground!');
        return res.redirect('/campground');
    }
    res.render('campground/show', { campground });
}

module.exports.indexCampground = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', { campgrounds });
}

module.exports.editCampground = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campground/edit', { campground });
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground({author: req.user._id, ...req.body.campground});
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${campground._id}`);
}

module.exports.updateCampground = async (req, res, next) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campground/${id}`);
}

module.exports.deleteCampground = async (req, res, next) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
}