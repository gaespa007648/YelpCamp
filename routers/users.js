const express = require('express');
const passport = require('passport');
const User = require('../modules/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get('/register', (req, res)=>{
    res.render('users/register');
})

router.post('/register', catchAsync( async (req, res, next)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        // We want to login after we register
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to the YelpCamp!');
            res.redirect('campground');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

router.get('/login', (req, res)=>{
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'Welcome back');
    const returnUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(returnUrl);
})

router.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/campground');  
})


module.exports = router;