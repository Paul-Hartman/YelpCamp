const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const {validateReview, isLoggedIn} =require("../middleware")


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// this one doesnt work!!!!!!!!


router.post('/', isLoggedIn,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    console.log(review.author)
    await review.save();
    await campground.save();
    
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('reviews/:reviewId', isLoggedIn,catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;