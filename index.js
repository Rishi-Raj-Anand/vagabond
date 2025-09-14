const express =require('express');
const mongoose = require("mongoose");
const path =require("path");
const Listing=require('./models/listing.js')
const app = express();
const port = 3000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));

// DB connection setup
const DB_URL="mongodb://127.0.0.1:27017/vagabond";

async function  connectDB(dburl){

    await mongoose.connect(dburl);

}

connectDB(DB_URL)
.then((req,res)=>{console.log("DB is connected...")})
.catch((err)=>{console.log("Error occurred...")});


// Routes
app.get("/",(req,res)=>{
    res.send("Welcome to vagabond")
});

app.get("/test",async (req,res)=>{
    let sampleListing=new Listing({
        title:"San Salvado",
        description:"Facing",
        price:12000,
        location:"El Salvador",
        country:"El Salvador",
    });

    await sampleListing.save();

    console.log("Sample saved ..");

    res.send("Successful DB testing");
})

//index route
app.get('/listing',async(req,res)=>{
    try{
        let allListing=await Listing.find();
        // res.send(allListing);
        res.render("listings/index.ejs",{allListing});
    }catch(err){

    }
});

// show Route
app.get("/listing/:id",async (req,res)=>{
    try{
        const {id}=req.params;
        let listing = await Listing.findById(id);
        // console.log(listing);
        // res.send(listing);
        res.render("listings/show.ejs",{listing});
    }catch(err){

    }
});


// Starting server
app.listen(port,()=>{
    console.log(`server is listening at port : ${port}`);
})