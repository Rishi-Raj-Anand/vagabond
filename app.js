if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express = require('express');
const mongoose = require("mongoose");
const DB_URL = process.env.ATLASDB_URL;
const app = express();
let port = process.env.PORT_NUMBER;
const listingRoute=require('./routes/listing.js')
const reviewRoute=require('./routes/review.js')
const userRoute=require('./routes/user.js')
const cookieParser = require('cookie-parser')

const session = require('express-session')
const MongoStore = require('connect-mongo');    

const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js')

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const store=MongoStore.create({
    mongoUrl:DB_URL,
    dbName: 'vagabond',
    secret:process.env.SECRETCODE,
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("Error in MONGO SESSION STORE",err)
})

const sessionOptions={
  store,  
  secret:process.env.SECRETCODE,
  resave: false,
  saveUninitialized: true, 
  cookie: {
        //  secure: true,
     expires:Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly:true}
}



app.use(session(sessionOptions))

app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

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
async function connectDB(dburl) {
    await mongoose.connect(dburl,{
        dbName: 'vagabond'
    });
}

connectDB(DB_URL)
    .then((req, res) => { console.log("DB is connected ...") })
    .catch((err) => { console.log("Error occurred ...") })

//-------------------------------------------------- Routes-------------------------------------------

app.use((req, res, next) => {
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error'); 
    res.locals.currUser=req.user || null;
    next()
});

// Routes
app.get("/", (req, res) => {
    res.redirect("/listings")
    
})

 
app.use('/user',userRoute); 
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