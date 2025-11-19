const express=require('express')
const router=express.Router({mergeParams:true})
const ExpressError=require('../utils/ExpressError')
const asyncWrap=require('../utils/asyncWrap.js')
const listingValidation=require('../schemeValid/listing.js')
const Listing = require('../models/listing.js');
const flash = require('connect-flash');


const validateListing=(req,res,next)=>{
    const result=listingValidation.validate(req.body);
    // console.log(res);
    if(result.error){
        throw new ExpressError(400,result.error)
    }else{
        next();
    }
}

// Index Route
router.get("/", asyncWrap(async (req, res) => {
    const allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
}))

// Create route
router.get("/new",(req, res) => {
    res.render("listings/new.ejs")
})

router.post("/",validateListing, asyncWrap(async (req, res) => {
    const newlisting = new Listing(req.body.listing)
    await newlisting.save()
    req.flash("success","New Listing Created")
    res.redirect("/listings")
}))

// Update Route

router.get("/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

router.put("/:id",validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash("success","Listing Updated")
    res.redirect(`/listings/${id}`)

}))


// Delete Route
router.delete("/:id", asyncWrap(async (req, res) => { 
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success","Listing Deleted")
    res.redirect('/listings')
}))

// Show Route
router.get("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    // console.log("Test",id)
    const listing = await Listing.findById(id).populate('reviews')
    if(!listing){
        req.flash("error","Listing doesn't exists!")
        res.redirect('/listings')
    }else{
        // console.log(listing); 
    res.render('listings/show.ejs', { listing })
    }
    
}))

module.exports=router;