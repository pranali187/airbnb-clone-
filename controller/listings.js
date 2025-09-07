const listing = require("../models/listings");
const axios = require("axios");

module.exports.index = async (req, res) => {
    let allListings = await listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.new = async (req, res) => {
    res.render("listings/new");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    })
        .populate("owner");
    if (!list) {
        req.flash("error", "This listing is deleted");
        return res.redirect("/listings");
    }
    res.render("listings/show", { list });
}

module.exports.createListings = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };

    const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: newListing.location,
            format: "json",
            limit: 5
        },
        headers: {
        "User-Agent": "airbnbclone/1.0 (jagadalepranali72@gmail.com)"  // required
    }

    });

    if (geoRes.data.length > 0) {
        newListing.geometry = {
            type: "Point",
            coordinates: [
                parseFloat(geoRes.data[0].lon),
                parseFloat(geoRes.data[0].lat)
            ]
        };
    }


    await newListing.save();
    req.flash("succes", "New Listing Created");
    res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
    let { id } = req.params;
    let list = await listing.findById(id);
    if (!list) {
        req.flash("error", "This listing is deleted");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { list });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let newListing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = { filename, url };
        await newListing.save();
    }

    req.flash("succes", "Listing Edited Succesfully");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id, { ...req.body.listing });
    req.flash("succes", "Listing Deleted Succesfully");
    res.redirect("/listings");
}