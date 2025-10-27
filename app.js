const express=require('express');
const mongoose = require("mongoose");
const app=express();
let port=8080;

const Listing=require('./models/listing.js');

app.use(express.urlencoded({ extended: true }));

// EJS template
const ejsmate=require('ejs-mate')
app.engine('ejs',ejsmate)

// EJS setup 
app.set("view engine","ejs");
const path =require("path") 
app.set("views",path.join(__dirname,"/views")); 

// Serving static file
app.use(express.static(path.join(__dirname,"/public")));

// Method override
const methodOverride = require('method-override')
app.use(methodOverride("_method"))

// DB Connection
const DB_URL="mongodb://127.0.0.1:27017/vagabond";

async function  connectDB(dburl){
    await mongoose.connect(dburl);
}

connectDB(DB_URL)
.then((req,res)=>{console.log("DB is connected ...")})
.catch((err)=>{console.log("Error occurred ...")})


// Routes
app.get("/",(req,res)=>{
    res.redirect("/listings")
})

// Index Route
app.get("/listings",async (req,res)=>{
    const allListing=await Listing.find({})
    res.render("listings/index.ejs",{allListing});
})

// Create route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})

app.post("/listings",async(req,res)=>{
    const newlisting=new Listing(req.body.listing)
    await newlisting.save()
    res.redirect("/listings")
})

// Update Route

app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params
    let listing=await Listing.findById(id)
    res.render("listings/edit.ejs",{listing})
})

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`)

})


// Delete Route
app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params
    await Listing.findByIdAndDelete(id)
    res.redirect('/listings')
})

// Show Route
app.get("/listings/:id",async (req,res)=>{
    const {id}=req.params;
    const listing = await Listing.findById(id)
    res.render('listings/show.ejs',{listing})
})



app.listen(port,()=>{
    console.log(`app is listening at port ${port}`);
});