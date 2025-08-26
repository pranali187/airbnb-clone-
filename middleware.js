const { listingSchema, reviewSchema } = require('./schema');
const ExpressError = require('./UTILS/ExpressError');
const listing = require('./models/listings');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You have to login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let newListing = await listing.findById(id);
    if (!newListing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "you are not owner of this listing ");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);  
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "you did not created this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}