module.exports.isLoggedin=(req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash('error',"You must be logged in to do this");
        return res.redirect('/user/login');
    }

    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        // console.log("updating local to ",req.session.redirectUrl)
        res.locals.redirectUrl=req.session.redirectUrl;
        
    }

    next()
}