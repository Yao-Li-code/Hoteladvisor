const User=require('../models/user');

module.exports.renderSignup=(req,res)=>{
    res.render('users/signup')
    }

module.exports.signup=async (req, res,next) => {
    try{
         const { email, username, password } = req.body;
         const user = new User({ email, username });
         const registeredUser = await User.register(user, password);
         req.login(registeredUser,err=>{
             if(err) return next(err);
             req.flash('success', 'Welcome to Hoteladvisor!');
         res.redirect('/hotels');
         })
         }
         catch(e){
             req.flash('error', e.message);
             res.redirect('signup')
             
         }
        
         
     
         }

module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
    
    }
module.exports.login=(req,res)=>{
    req.flash('success', 'welcome back!');
    const redirectUrl=req.session.returnTo || '/hotels';
    delete req.session.returnTo
   res.redirect(redirectUrl)
}

module.exports.logout=(req,res)=>{
    req.logout();
    res.redirect('/hotels')
    
    }