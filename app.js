const express = require('express');
const mongoose = require("mongoose");
const app = express();
let port = 8080;
const listingRoute=require('./routes/listing.js')
const reviewRoute=require('./routes/review.js')


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

//-------------------------------------------------- Routes-------------------------------------------

// Routes
app.get("/", (req, res) => {
    res.redirect("/listings")
})

app.use('/listings',listingRoute);
app.use('/listings/:id/review',reviewRoute);


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