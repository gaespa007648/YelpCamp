const User = require('../modules/user');

module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login');
}

module.exports.register = async (req, res, next)=>{
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
}

module.exports.login = (req, res)=>{
    req.flash('success', 'Welcome back');
    const returnUrl = req.session.returnTo || '/campground';
    delete req.session.returnTo;
    res.redirect(returnUrl);
}

module.exports.logout = (req, res)=>{
    req.logOut();
    res.redirect('/campground');  
}
