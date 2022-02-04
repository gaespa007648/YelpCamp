const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedsHelper');
const Campground = require('../modules/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp') // The default port of mongoDB is 27017
    .then(() => {
        console.log('Success in connection!');
    })
    .catch(err => {
        console.log('Fail in connection!');
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany({});
    const dataLength = 10;
    const photosHelper = await import('./photosHelper.mjs'); // import mjs is asyn, and return a Promise.
    const photosRes =  await photosHelper.getPhoto(dataLength).then(res=>{
        return res.response;
    });

    for(let i=0; i<dataLength; i++){
        let rand = Math.floor(Math.random()*cities.length);
        let newCamp = new Campground({
            author: '61fcbccdf77f006bb6747162',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand].city}, ${cities[rand].state}`,
            price: Math.floor(Math.random()*1000+10),
            image: `${photosRes[i].urls.small}`,
            description: 'Today is a beautiful day!'
        });
        await newCamp.save();
    }
    console.log('SAVE COMPLETE');
}
seedDB();
