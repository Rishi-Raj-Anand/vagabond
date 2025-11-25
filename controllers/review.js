const reviewValidation = require('../schemeValid/review.js')
const Review = require('../models/review.js')
const Listing = require('../models/listing.js');

module.exports.postReview=async (req, res) => {
    const { id } = req.params;
    const review = new Review(req.body.review)
    review.author=req.user._id;
    const listing = await Listing.findById(id)
    listing.reviews.push(review);   
    await listing.save();
    await review.save()
    res.redirect(`/listings/${id}`)
}

module.exports.deleteReview=async (req, res) => {
    const { id, rid } = req.params;
    // console.log("rid:",rid)
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } })
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${id}`)
}