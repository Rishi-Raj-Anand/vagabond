const express=require('express')
const router=express.Router({mergeParams:true});
const ExpressError=require('../utils/ExpressError')
const asyncWrap=require('../utils/asyncWrap.js')
const reviewValidation=require('../schemeValid/review.js')
const Review=require('../models/review.js')
const Listing = require('../models/listing.js');

const validateReview=(req,res,next)=>{
    const result=reviewValidation.validate(req.body);
    // console.log(result);     
    if(result.error){
        throw new ExpressError(400,result.error)
    }else{
        next()
    }
}

router.post("/",validateReview,asyncWrap(async (req,res)=>{
    const {id}=req.params;
    const review=Review(req.body.review)
    const listing = await Listing.findById(id)
    listing.reviews.push(review);
    await listing.save();
    await review.save()
    res.redirect(`/listings/${id}`)
}))

router.delete('/:rid',asyncWrap(async (req,res)=>{
    const {id,rid}=req.params;
    // console.log("rid:",rid)
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:rid}})
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${id}`)
}))

module.exports=router;