const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

// Schema.post will be trigger when you call 'findOneAndDelete'
// The deleted instance will be passed in doc.
// This function is belonged to query middleware. We will get warning...
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);