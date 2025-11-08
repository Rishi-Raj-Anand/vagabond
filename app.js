const express = require('express');
const mongoose = require("mongoose");
const app = express();
const ExpressError=require('./utils/ExpressError.js')
const asyncWrap=require('./utils/asyncWrap.js')
const listingValidation=require('./schemeValid/listing.js')
const Review=require('./models/review.js')
let port = 8080;

const Listing = require('./models/listing.js');

app.use(express.urlencoded({ extended: true }));

// EJS template
const ejsmate = require('ejs-mate')
app.engine('ejs', ejsmate)

// EJS setup 
app.set("view engine", "ejs");
const path = require("path")
app.set("views", path.join(__dirname, "/views"));

// Serving static file
app.use(express.static(path.join(__dirname, "/public")));

// Method override
const methodOverride = require('method-override');
const review = require('./models/review.js');
app.use(methodOverride("_method"))

// DB Connection
const DB_URL = "mongodb://127.0.0.1:27017/vagabond";

async function connectDB(dburl) {
    await mongoose.connect(dburl);
}

connectDB(DB_URL)
    .then((req, res) => { console.log("DB is connected ...") })
    .catch((err) => { console.log("Error occurred ...") })



//---------------------------------------------Listing Model---------------------------------------
// Middlewares
const validateListing=(req,res,next)=>{
    const result=listingValidation.validate(req.body);
    // console.log(res);
    if(result.error){
        throw new ExpressError(400,result.error)
    }else{
        next()
    }
}
// Routes
app.get("/", (req, res) => {
    res.redirect("/listings")
})

// Index Route
app.get("/listings", asyncWrap(async (req, res) => {
    const allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
}))

// Create route
app.get("/listings/new",(req, res) => {
    res.render("listings/new.ejs")
})

app.post("/listings",validateListing, asyncWrap(async (req, res) => {
    const newlisting = new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listings")
}))

// Update Route

app.get("/listings/:id/edit", asyncWrap(async (req, res) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing })
}))

app.put("/listings/:id",validateListing, asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)

}))


// Delete Route
app.delete("/listings/:id", asyncWrap(async (req, res) => { 
    let { id } = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
}))

// Show Route
app.get("/listings/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews')
    if(!listing){
        throw new ExpressError(400,'Bad Request');
    }
    // console.log(listing);
    res.render('listings/show.ejs', { listing })
}))

//------------------------------------------Review Model----------------------------------------------

app.post("/listings/:id/review",asyncWrap(async (req,res)=>{
    const {id}=req.params;
    const review=Review(req.body.review)
    const listing = await Listing.findById(id)
    listing.reviews.push(review);
    await listing.save();
    await review.save()
    res.redirect(`/listings/${id}`)
}))

app.delete('/listings/:id/review/:rid',asyncWrap(async (req,res)=>{
    const {id,rid}=req.params;
    console.log("rid:",rid)
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:rid}})
    await Review.findByIdAndDelete(rid);
    res.redirect(`/listings/${id}`)
}))
// --------------------------------------Error Handling------------------------------------------------

app.use((err,req,res,next)=>{
    const {status=500,message="Something went wrong"}=err;
    console.log(err)
    res.status(status).render('listings/Error.ejs',{message});
})

app.use((req, res,next) => {
    res.send("PAGE NOT FOUND !!!")
})

app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});