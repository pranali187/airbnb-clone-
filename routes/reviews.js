const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require('../models/listings');
const Review = require('../models/review');
const wrapAsync = require('../UTILS/wrapAsync');
const {isLoggedIn ,validateReview, isReviewAuthor} = require('../middleware')

const ListingController = require('../controller/review')

//post review rout
router.post("/", isLoggedIn, validateReview, wrapAsync(ListingController.createReview));

//destroy review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,wrapAsync(ListingController.destroyReview))

module.exports = router;