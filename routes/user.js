const express=require('express')
const router=express.Router();
const passport=require('passport');
const asyncWrap = require('../utils/asyncWrap.js');
const { saveRedirectUrl,isLoggedin } = require('../middlewares.js');
const LocalStrategy=require('passport-local');

const {logoutUser,signinUser,getSigninForm,getLoginForm,loginUser,getProfile}=require('../controllers/user.js')

router.route('/signin')
    .get(getSigninForm)
    .post(asyncWrap(signinUser));


router.route('/login')
    .get(getLoginForm)
    .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/user/login',failureFlash:true }),loginUser)

router.get('/logout',logoutUser)

router.get('/profile',isLoggedin,asyncWrap(getProfile))

module.exports=router; 