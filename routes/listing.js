if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express = require('express')
const router = express.Router({ mergeParams: true })
const ExpressError = require('../utils/ExpressError')
const asyncWrap = require('../utils/asyncWrap.js')
const flash = require('connect-flash');
const { isLoggedin,isListingOwner,validateListing } = require('../middlewares.js')


const {getIndexpage,searchPlaces,listingForm,updateListing,newListing,updateForm,deleteListing,showListing}=require('../controllers/listing.js')

const multer  = require('multer')
const {storage}=require('../cloudConfig.js')
const upload = multer({ storage })


// Index Route
router.get("/", asyncWrap(getIndexpage))

// search Route
router.post("/search",asyncWrap(searchPlaces))

// Create route
router.get("/new", isLoggedin, listingForm)

router.post("/",isLoggedin,validateListing,upload.single('listing[image]'),asyncWrap(newListing))

// Update Route

router.get("/:id/edit", isLoggedin,isListingOwner, asyncWrap(updateForm))


router.put("/:id", isLoggedin,isListingOwner, validateListing,upload.single('listing[image]'), asyncWrap(updateListing))

// Delete Route
router.delete("/:id", isLoggedin,isListingOwner, asyncWrap(deleteListing))

// Show Route
router.get("/:id", asyncWrap(showListing))

module.exports = router;