//require
// --------------------------------------------------------------------------------------------------------------
const express = require('express')
const path = require("path");
const ejsMate = require("ejs-mate"); //layout package
const methodOverride = require("method-override");
const session = require('express-session')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')
// const LocalStrategy  = require('passport-local').Strategy
const app = express()

//require error class
const ExpressError = require('./utils/ExpressError')

//require models
const User = require('./models/user')


//require routes
const userRoutes = require('./routes/users')
const leaveAppRoutes = require('./routes/leaveApplication')
const teacherNoticeRoutes = require('./routes/teacherNotice')
const universityNoticeRoutes = require('./routes/universityNotice')
const routineRoutes = require('./routes/routine')

// --------------------------------------------------------------------------------------------------------------


//ejs setup & path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

//ejs mate
app.engine("ejs", ejsMate); //for using ejs-mate we have to do it


//middleware
//---------------------------------------------------------------------------------------------------------------
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); //Serving static Assets (public directory)

const sessionConfig = {
    secret:'thisisasecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  // cookie will remain 7 days on browser
        maxAge:1000 * 60 * 60 * 24 * 7                  // cookie will remain 7 days on browse
    }
}
app.use(session(sessionConfig))         //session execute
app.use(flash())                        //flash execute

//passport
//----------------------------------------------------------
//In your application's setup, configure Passport to use the
//"passport-local" strategy, and tell it to use the User model 
//defined with passport-local-mongoose:

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// app.use(passport.initialize())
// app.use(passport.session())

// // Local strategy for authenticating User model
// passport.use('user-local', new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // Local strategy for authenticating Teacher model
// passport.use('teacher-local', new LocalStrategy(Teacher.authenticate()));
// passport.serializeUser(Teacher.serializeUser());
// passport.deserializeUser(Teacher.deserializeUser());




//flash middleware
app.use((req,res,next)=>{
    res.locals.successMessage = req.flash('success')    //key is 'success'
                                                        // 'successMessage' is now accessed from anywhere (ejs or boilerplate)
    res.locals.errorMessage = req.flash('error')        //key is 'error'

    res.locals.currentUser = req.user   //passport added user information in the request 
                                        //now currentUser is accessed from anywhere
    next()
})



// --------------------------------------------------------------------------------------------------------------



//server 
// --------------------------------------------------------------------------------------------------------------
app.listen(4000,()=>{
    console.log('Server Started at port 4000')
})
// --------------------------------------------------------------------------------------------------------------


//connection with mongoose
//---------------------------------------------------------------------------------------------------------------
mongoose.connect('mongodb://localhost:27017/collegePortal') //connected to YelpCamp database
    .then(() => {
        console.log('Mongo connnection successful: ')
    })
    .catch((e) => {
        console.log('Mongo connection failed !!')
        // console.log(e)
    })
//---------------------------------------------------------------------------------------------------------------



//All routes listed below
// --------------------------------------------------------------------------------------------------------------

//User Route
app.use('/',userRoutes)

//leave Application Route
app.use('/leaveApplications',leaveAppRoutes)

//notice Routes
app.use('/teacherNotices',teacherNoticeRoutes)

//university Notice Route
app.use('/universityNotices',universityNoticeRoutes)

//Routine Route
app.use('/routines',routineRoutes)


//if no route is match then its run
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

//error handling middleware (respond with a ejs page)
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) {
        err.message = 'something went wrong !!'
    }
    res.status(statusCode).render('errorPages/error', { err })
})

// --------------------------------------------------------------------------------------------------------------

//mfahim181238@bscse.uiu.ac.bd ---> student
//maf181238@gmail.com ---> guardian
//fahimarefin5@gmail.com---> teacher

//first seed - student (30)
//then seed - teacher (30)
//then seed - guardian (30)
//then seed - userReationSeed   (faculty[0] --> first 15 students classteacher)
//                              (faculty[1] --> last 15 students classteacher)

