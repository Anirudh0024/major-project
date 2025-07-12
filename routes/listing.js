const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validateListing } = require("../middleware.js");

const listingController=require("../controllers/listings.js")

// INDEX ROUTE
router.get(
  "/",
  wrapAsync(listingController.index)
);

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

// CREATE ROUTE
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

//  EDIT ROUTE
router.get("/:id/edit" ,isLoggedIn,isOwner,listingController.renderEditForm );

// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE ROUTE
router.delete("/:id", isLoggedIn,isOwner, listingController.deleteListing);

module.exports = router;
