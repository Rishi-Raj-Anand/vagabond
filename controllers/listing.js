const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const Listing = require('../models/listing.js');
const flash = require('connect-flash');
const ExpressError = require('../utils/ExpressError')


module.exports.getIndexpage=async (req, res) => {
    const allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
}

module.exports.searchPlaces=async(req,res)=>{
    let {q}=req.body;

    if (!q) {
        return res.redirect('/listings');
    }

    q=q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regexPattern = new RegExp(q, 'i');
    try {
        const allListing = await Listing.find({$or:[{ description: regexPattern },{ title: regexPattern },{ location: regexPattern },{ country: regexPattern }]});
        if (allListing.length === 0) {
             req.flash('error', 'No listings found matching your search.');
             return res.redirect('/listings');
        }
        res.render("listings/index.ejs", { allListing });
    } catch (err) {
        console.error(err);
        req.flash('error',error.message);
        res.redirect('/listings');
    }

}

module.exports.listingForm=(req, res) => {
    // console.log(req.user)
    res.render("listings/new.ejs")
}

module.exports.newListing=async (req, res) => {

    const response=await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
    })
    .send() 
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting = new Listing(req.body.listing)
    newlisting.owner=req.user._id;
    newlisting.geometry=response.body.features[0].geometry;
    newlisting.image={url,filename}
    newlisting=await newlisting.save()
    req.flash("success", "New Listing Created")
    res.redirect("/listings")
}

module.exports.updateForm=async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    const response=await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
    })  
    .send() 
    await Listing.findByIdAndUpdate(id, { ...req.body.listing,geometry:response.body.features[0].geometry })
    if(typeof req.file!='undefined'){
        let url=req.file.path;
        let filename=req.file.filename;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing,image:{url,filename} })
    }

    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)

}

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted")
    res.redirect('/listings')
}

module.exports.showListing=async (req, res) => {
    const {id}=req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{ path:"author",}}).populate('owner')
    if (!listing) {
        req.flash("error", "Listing doesn't exists!")
        res.redirect('/listings')
    } else {
        // console.log(listing); 
        res.render('listings/show.ejs', { listing })
    }

}

