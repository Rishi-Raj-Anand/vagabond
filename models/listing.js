const mongoose = require("mongoose");

const listingSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    description:String,

    image:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1750157232617-865d705f6b2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI4fHx8ZW58MHx8fHx8",
        set: ({url})=>url===""
        ?"https://plus.unsplash.com/premium_photo-1750157232617-865d705f6b2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI4fHx8ZW58MHx8fHx8"
        :url,
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;