const mongoose=require('mongoose')

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true

    },
    description:String,
    image:{
        type:String,
        set: (v)=>v.url===""?"../assets/logo.png":v.url,
    },
    price:Number,
    location:String,
    country:String

})

const Listing=mongoose.model('Listing',listingSchema);
module.exports=Listing;