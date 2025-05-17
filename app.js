const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wandurlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs"), app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("working");
});
// app.get("/testListing", async(req,res)=>{
// let sampleListing=new Listing({
//     tittle:"My home",
//     description:"By the beach",
//     price:1200,
//     location:"calanguet Goa",
//     country:"india"
// });
// await sampleListing.save();
// console.log("sample was saved")
// res.send("successful testing")
// })

// INDEX ROUTE
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

// NEW ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    try {
      const listing = await Listing.findById(id);
      res.render("listings/show.ejs", { listing });
    } catch (err) {}
  })
);

// CREATE ROUTE
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    // let {tittle,description,image,price,country,location}=req.body;
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid datafor listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//  EDIT ROUTE
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "send valid data for listing");
  }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedLsting = await Listing.findByIdAndDelete(id);
    console.log(deletedLsting);
    res.redirect("/listings");
  })
);

app.all("/", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).send(message);
});
app.listen(8080, () => {
  console.log(`server is listening to port at port 8080`);
});
