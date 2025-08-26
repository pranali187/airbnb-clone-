const Listing = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    let newrev = new Review(req.body.review);
    newrev.author = req.user._id;

    listing.reviews.push(newrev);
    await newrev.save();
    await listing.save();

    req.flash("success", "New Review Added Successfully");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req,res)=>{
    let { id ,reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId} })
    await Review.findByIdAndDelete(reviewId);

    req.flash("succes", "Review Deleted Succesfully");
    res.redirect(`/listings/${id}`);
}