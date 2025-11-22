const express = require('express')
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError')
const asyncWrap = require('../utils/asyncWrap.js')
const reviewValidation = require('../schemeValid/review.js')
const Review = require('../models/review.js')
const Listing = require('../models/listing.js');
const { isLoggedin,isReviewAuthor,validateReview } = require('../middlewares.js')


router.post("/", isLoggedin, validateReview, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review)
    review.author=req.user._id;
    const listing = await Listing.findById(id)
    listing.reviews.push(review);   
    await listing.save();
    await review.save()
    res.redirect(`/listings/${id}`)
}))

router.delete('/:rid', isLoggedin,isReviewAuthor, asyncWrap(async (req, res) => {
    const { id, rid } = req.params;
    // console.log("rid:",rid)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } })
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${id}`)
}))

module.exports = router;