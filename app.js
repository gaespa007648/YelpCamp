const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const campgroundsRouter = require('./routers/campgrounds');
const reviewsRouter = require('./routers/reviews');
const usersRouter = require('./routers/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./modules/user');

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
app.use(express.static(path.join(__dirname, 'public')));   // Setting Public Derectory, or the client side cannot read client js scripts.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Set session information
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires : Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
};
app.use(session(sessionConfig));
app.use(flash());

// Set authentication
app.use(passport.initialize());
app.use(passport.session());
// Some functions are static functions that add to the class (authenticate, serializeUser, deserializeUser)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// When every requests come in, retrieve the flash value == 'Success' and store it in res.locals
app.use((req, res, next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', usersRouter);
app.use('/campground', campgroundsRouter);         // route to campgrounds router
app.use('/campground/:id/reviews', reviewsRouter); // route to reviews router
app.use('/', campgroundsRouter);

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