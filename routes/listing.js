const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// INDEX ROUTE
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
  console.log(req.user);
  // console.log(`GET /listings/new - req.path: ${req.path}`);
  res.render("listings/new.ejs");
});

// SHOW ROUTE
router.get("/:id", async (req, res) => {
  // console.log(`GET /listings/:id - req.path: ${req.path}, req.params:`, req.params);
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing You requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    // console.log("error",err);
    res.render("404.ejs");
  }
});

// CREATE ROUTE
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // console.log(`POST /listings - req.path: ${req.path}`);

    const newListing = new Listing(req.body.listing);
    console.log(req.user)
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//  EDIT ROUTE
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  // console.log(`GET /listings/:id/edit - req.path: ${req.path}, req.params:`, req.params);
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
// UPDATE
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE
router.delete("/:id", isLoggedIn, async (req, res) => {
  console.log(
    `DELETE /listings/:id - req.path: ${req.path}, req.params:`,
    req.params
  );
  let { id } = req.params;
  let deletedLsting = await Listing.findByIdAndDelete(id);
  console.log(deletedLsting);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
});

module.exports = router;
