const express = require("express");
const path = require("path")
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session")
const flash = require("connect-flash")
const Review = require("./models/review") 
const {campgroundSchema, reviewSchema} =require("./schemas.js")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const methodOverride = require("method-override")
const Campground = require("./models/campground")
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("database Connected")
})

const app = express();


app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))
const sessionConfig = {
    secret: "thisIsABadSecret",
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires:Date.now() + 1000 * 60 *60 * 24 * 7,
        maxAge: 1000 * 60 *60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(flash());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    
    res.locals.error = req.flash("error");
    next();
})


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)


app.get('/', (req,res)=>{
    res.render("home")
})





app.post("/campground/:id/reviews", catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id) 
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created New Review")
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted Review")
    res.redirect(`/campgrounds/${id}`)
}))

app.all("*", (req,res,next)=>{
    next(new ExpressError("Page not Found", 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no something went wrong"
    res.status(statusCode).render("error", {err})
})

app.listen(3000, ()=>{
    console.log("serving on port 3000")
})

