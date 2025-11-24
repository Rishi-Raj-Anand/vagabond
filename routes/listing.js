const express = require('express')
const router = express.Router({ mergeParams: true })
const ExpressError = require('../utils/ExpressError')
const asyncWrap = require('../utils/asyncWrap.js')
const Listing = require('../models/listing.js');
const flash = require('connect-flash');
const { isLoggedin,isListingOwner,validateListing } = require('../middlewares.js')
require('dotenv').config()
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Route
router.get("/", asyncWrap(async (req, res) => {
    const allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
}))

// Create route
router.get("/new", isLoggedin, (req, res) => {
    // console.log(req.user)
    res.render("listings/new.ejs")
})

router.post("/",isLoggedin,validateListing, asyncWrap(async (req, res) => {
    const response=await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
    })
    .send() 
  
    let newlisting = new Listing(req.body.listing)
    newlisting.owner=req.user._id;
    newlisting.geometry=response.body.features[0].geometry;
   
    newlisting=await newlisting.save()
    console.log(newlisting)
    req.flash("success", "New Listing Created")
    res.redirect("/listings")
}))

// Update Route

router.get("/:id/edit", isLoggedin,isListingOwner, asyncWrap(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

router.put("/:id", isLoggedin,isListingOwner, validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    const response=await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
    })  
    .send() 
    await Listing.findByIdAndUpdate(id, { ...req.body.listing,geometry:response.body.features[0].geometry })
    req.flash("success", "Listing Updated")
    res.redirect(`/listings/${id}`)

}))


// Delete Route
router.delete("/:id", isLoggedin,isListingOwner, asyncWrap(async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success", "Listing Deleted")
    res.redirect('/listings')
}))

// Show Route
router.get("/:id", asyncWrap(async (req, res) => {
    const {id}=req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate:{ path:"author",}}).populate('owner')
    if (!listing) {
        req.flash("error", "Listing doesn't exists!")
        res.redirect('/listings')
    } else {
        // console.log(listing); 
        res.render('listings/show.ejs', { listing })
    }

}))

module.exports = router;