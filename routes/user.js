const express=require('express')
const router=express.Router();
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('../models/user.js');
const asyncWrap = require('../utils/asyncWrap.js');


router.get("/signin",(req,res)=>{
    res.render('../views/user/signin.ejs')
})

router.post("/signin",asyncWrap(async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const user=new User({username,email});

        const registeredUser=await User.register(user,password);

        req.flash('success',"Welcome to Vagabond")
        res.redirect('/listings')
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/user/signin');
    }
}))

router.get("/login",(req,res)=>{
    res.render('../views/user/login.ejs')
})

router.post("/login",passport.authenticate('local', { failureRedirect: '/user/login',failureFlash:true }),(req,res)=>{
    
    req.flash('success',`Welcome back ${req.body.username} `)
    res.redirect('/listings')
    
})



module.exports=router;