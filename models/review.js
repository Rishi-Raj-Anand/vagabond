const mongoose=require('mongoose');
const {Schema}=mongoose;

const reviewschema=mongoose.Schema({
    likes:{
        type:Number,
    },
    comment:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

module.exports=mongoose.model('Review',reviewschema);