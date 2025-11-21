const express = require('express');
const mongoose = require("mongoose");
const app = express();
let port = 8080;
const listingRoute=require('./routes/listing.js')
const reviewRoute=require('./routes/review.js')
const userRoute=require('./routes/user.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('connect-flash');

const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user.js')

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const sessionOptions={
  secret: 'vagabondxyz',
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
const DB_URL = "mongodb://127.0.0.1:27017/vagabond";

async function connectDB(dburl) {
    await mongoose.connect(dburl);
}

connectDB(DB_URL)
    .then((req, res) => { console.log("DB is connected ...") })
    .catch((err) => { console.log("Error occurred ...") })

//-------------------------------------------------- Routes-------------------------------------------


app.use((req,res,next)=>{
    app.locals.success=req.flash('success');
    app.locals.error=req.flash('error');    
    next()
})
// Routes
app.get("/", (req, res) => {
    res.redirect("/listings")
    
})

app.get("/demouser",async(req,res)=>{
    const user=new User({
        email:"rika@gmail.com",
        username:"rika"
    })

    let regUser=await User.register(user,"rika@123");
    res.send(regUser);
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