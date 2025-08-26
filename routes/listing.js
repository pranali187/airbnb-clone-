const express = require('express');
const router = express.Router();
const wrapAsync = require('../UTILS/wrapAsync');
const listing = require('../models/listings');
const { isLoggedIn, isOwner, validateListings } = require('../middleware')
const multer = require("multer");
const { storage } = require("../cloudconfig");
const upload = multer({ storage }); //store all images here

const ListingController = require('../controller/listings')

router.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn ,validateListings, upload.single('listing[image]'), wrapAsync(ListingController.createListings))

router.get("/new", isLoggedIn, wrapAsync(ListingController.new))

router.route("/:id")
.get(wrapAsync(ListingController.show))
.put(isOwner, validateListings, isLoggedIn, upload.single('listing[image]'), wrapAsync(ListingController.updateListing))
.delete(isOwner, isLoggedIn, wrapAsync(ListingController.destroyListing))

router.get("/:id/edit", isLoggedIn, wrapAsync(ListingController.edit))
 

//index
router

//new
router

//show
router

//create
router
//edite
router

//updateListing
router

//deleteListing
router

module.exports = router;