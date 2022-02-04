const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgroundController = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

// MVC Model, we define the functions in C(Controller) and pass it in router.
router.get('/new', isLoggedIn, catchAsync(campgroundController.newCampground));

router.route('/:id')
    .get(catchAsync(campgroundController.displayCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundController.updateCampground))
    .delete(isLoggedIn, catchAsync(campgroundController.deleteCampground));

router.route('/')
    .get(catchAsync(campgroundController.indexCampground))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundController.editCampground));

module.exports = router;