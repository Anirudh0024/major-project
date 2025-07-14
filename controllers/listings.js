const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
};

module.exports.renderNewForm = (req, res) => {
  console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing You requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    res.render("404.ejs");
  }
};

module.exports.createListing = async (req, res, next) => {
  let url=req.file.path;
  let filename=req.file.filename;
  console.log(url,"..",filename)
  const newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image={url,filename}
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!")
    res.redirect("/listings")
  }
  let originalImageUrl=listing.image.url;
 originalImageUrl= originalImageUrl.replace("/upload","/upload/w_300")
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
 let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
 if(typeof req.file !=="undefined"){
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename}
  await listing.save()
 }
 req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  console.log(
    `DELETE /listings/:id - req.path: ${req.path}, req.params:`,
    req.params
  );
  let { id } = req.params;
  let deletedLsting = await Listing.findByIdAndDelete(id);
  console.log(deletedLsting);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
