const mongoose=require('mongoose')
const initData = require('./data.js')
const Listing=require('../models/listing.js')

// DB Connection
const DB_URL="mongodb://127.0.0.1:27017/vagabond";

async function  connectDB(dburl){
    await mongoose.connect(dburl);
}

connectDB(DB_URL)
.then((req,res)=>{console.log("DB is connected ...")})
.catch((err)=>{console.log("Error occurred ...")})


async function initDB(){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data is initialized")
}

initDB()

