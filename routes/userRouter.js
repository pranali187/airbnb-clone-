const express = require('express');
const router = express.Router();
const wrapAsync = require('../UTILS/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware');

const ListingController = require('../controller/user');

router.route("/signup")
.get(ListingController.renderSignUp)
.post(wrapAsync(ListingController.signUp));

router.route("/login")
.get(ListingController.renderLogin)
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), wrapAsync(ListingController.login))

//logout
router.get("/logout",ListingController.logout);

module.exports = router;