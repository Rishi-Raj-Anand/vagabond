const mongoose = require('mongoose');
const sampleData= require('./data.js');
const Listing=require('../models/listing.js');


// DB connection setup
const DB_URL="mongodb://127.0.0.1:27017/vagabond";

async function  connectDB(dburl){

    await mongoose.connect(dburl);

}

connectDB(DB_URL)
.then((req,res)=>{console.log("DB is connected...")})
.catch((err)=>{console.log("Error occurred...")});

// Data initialization

async function initDB(){
    await Listing.deleteMany({});
    await Listing.insertMany(sampleData.data);
    console.log("DB is cleaned and re-initialized")
    await mongoose.disconnect();
    console.log("DB disconnected")
};

initDB();

