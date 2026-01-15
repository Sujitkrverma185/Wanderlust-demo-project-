const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner ,validateListing} = require("../middleware.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const listingsController = require("../controllers/listings.js");

//index route and create route
router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingsController.createListings));

//new route
router.get("/new",isLoggedIn, listingsController.renderNewForm);

//show route , update and delete route
router.route("/:id")
.get(wrapAsync( listingsController.showListing ))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingsController.updateListings))
.delete(isLoggedIn,isOwner,wrapAsync(listingsController.destroyListings));

// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingsController.renderEditForm));


module.exports = router;