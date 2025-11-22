const Listing = require('./models/listing.js');

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