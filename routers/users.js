const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();
const userController = require('../controllers/users');

router.route('/register')
    .get(userController.renderRegister)
    .post(catchAsync( userController.register ));

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), userController.login);

router.get('/logout', userController.logout);

module.exports = router;