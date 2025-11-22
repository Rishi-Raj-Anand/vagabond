const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const reviewValidation = require('./schemeValid/review.js')
const listingValidation = require('./schemeValid/listing.js')


module.exports.isLoggedin=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"You must be logged in to do this");
        return res.redirect('/user/login');
    }

    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        // console.log("updating local to ",req.session.redirectUrl)
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }

    next()
}

module.exports.isListingOwner=async (req,res,next)=>{
    try{
        let { id } = req.params
        let listing = await Listing.findById(id);
        if(!req.user._id.equals(listing.owner)){
            req.flash('error',"You don't have permission")
            return res.redirect(`/listings/${id}`)
        }
        next()
    }catch(err)
    {
        return res.redirect("/listings")
    }    
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    try{
        let { id,rid } = req.params
        let review = await Review.findById(rid);
        if(!req.user._id.equals(review.author._id)){
            req.flash('error',"You don't have permission")
            return res.redirect(`/listings/${id}`)
        }
        next()
    }catch(err)
    {
        return res.redirect(`/listings/${id}`)
    }    
}

module.exports.validateListing = (req, res, next) => {
    const result = listingValidation.validate(req.body);
    // console.log(res);
    if (result.error) {
        throw new ExpressError(400, result.error)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const result = reviewValidation.validate(req.body);
    // console.log(result);     
    if (result.error) {
        throw new ExpressError(400, result.error)
    } else {
        next()
    }
}