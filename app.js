if (process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


const express=require('express');
const path=require('path')
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate')
const methodOverride=require('method-override');
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const LocalPassport=require('passport-local');
const User=require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo').default;


const ExpressError = require('./helpers/expressError');


const hotels=require('./routes/hotels');
const reviews=require('./routes/reviews');
const users=require('./routes/users')
const dburl=process.env.DB_URL




mongoose.connect('mongodb://localhost:27017/hotel-review'
,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify: false
    
})


const db=mongoose.connection;
db.on('error',console.error.bind(console, "connection error:"));
db.once('open',()=>{
    console.log('Databse connected')
})
const app=express();


app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());


const store = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/hotel-review',
    secret: 'Thiswasappdevelopedbyjessica',
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig={
    store:store,
    name:'session',
    secret:'Thiswasappdevelopedbyjessica',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxage:1000*60*60*24*7

    }
}
app.use(session(sessionConfig))
app.use(flash())


app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalPassport(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    
   
    res.locals.user=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
   next()
})





app.use('/hotels',hotels)
app.use('/hotels/:id/reviews',reviews)
app.use('/',users)




app.get('/',(req,res)=>{
    res.render('home')
})











app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    //res.render('error')
    const {statusCode=500, message="Something went wrong"}=err;
    console.log(err)
    if (!err.message) err.message="Oh no, something went wrong!"
    res.status(statusCode).render('error',{err})
})





app.listen(3000,()=>{
    console.log('serving on port 3000')
})

