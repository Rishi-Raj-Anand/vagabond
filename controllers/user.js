const Listing = require('../models/listing.js');
const User=require('../models/user.js');
const Review=require('../models/review.js')

module.exports.logoutUser=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }

        req.flash('success','You are logged out')
        res.redirect('/listings')
    })
}

module.exports.signinUser=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const user=new User({username,email});

        const registeredUser=await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash('success',"Welcome to Vagabond")
            return res.redirect('/listings')
        })

        
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/user/signin');
    }
}

module.exports.loginUser=(req,res)=>{
    req.flash('success',`Welcome back ${req.body.username} `)
    const redirectUrl=res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl)
    
}

module.exports.getSigninForm=(req,res)=>{
    res.render('../views/user/signin.ejs')
}

module.exports.getLoginForm=(req,res)=>{
    res.render('../views/user/login.ejs')
}

module.exports.getProfile=async (req,res)=>{
    let user=req.user;
    let userListings= await Listing.find({owner:user._id})
    let reviews= await Review.find({author:user._id})
    res.render('../views/user/profile.ejs',{user,userListings,reviews})
}