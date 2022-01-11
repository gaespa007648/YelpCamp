const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./modules/campground');
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/yelpcamp') // The default port of mongoDB is 27017
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

app.get('/', (req, res)=>{
    res.redirect('campground');
})

app.get('/campground', async (req, res)=>{
    const campgrounds = await Campground.find({});
    res.render('campground/index', {campgrounds});
})

app.get('/campground/new', async (req, res)=>{
    res.render('campground/new');
})

app.get('/campground/:id', async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/show', {campground});
})

app.get('/campground/:id/edit', async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', { campground });
})

app.post('/campground', async (req, res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`);
})

app.put('/campground/:id', async (req, res)=>{
    const id = req.params.id;
    await Campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campground/${id}`);
})

app.delete('/campground/:id', async (req, res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground');
})


app.listen('3000', ()=>{
    console.log('Listening on port 3000...');
})