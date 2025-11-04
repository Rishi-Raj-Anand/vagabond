const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true

    },
    description: String,
    image: {
        type: String,
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v.url,
    },
    price: Number,
    location: String,
    country: String

})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;