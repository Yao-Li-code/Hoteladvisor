const express=require('express');
const router=express.Router();
const users=require('../controllers/users')
const wrap=require('../helpers/wrap');
const passport=require('passport');


router.route('/signup')
.get(users.renderSignup)
.post(wrap(users.signup));


router.route('/login')
.get(users.renderLogin)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),
users.login)


router.get('/logout',users.logout)
   



module.exports=router;