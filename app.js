// console.log("Server starting lalala");

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
const { listingSchema } = require("./schema.js");
async function main() {
  await mongoose.connect(MONGO_URL);
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs"), app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"), app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// New middleware to handle static file 404s
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.url.startsWith("/listings/") &&
    !req.url.startsWith("/")
  ) {
    // Adjust the condition as needed
    const filePath = path.join(__dirname, "public", req.url);
    if (!fs.existsSync(filePath)) {
      // Use fs.existsSync
      console.log(`Static file not found: ${req.url}`);
      return res.status(404).send("Static file not found"); // Send a 404 response
    }
  }
  next();
});

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  console.log(`GET / - req.path: ${req.path}`);
  res.send("working");
});
// app.get("/testListing", async(req,res)=>{
// let sampleListing=new Listing({
//     tittle:"My home",
//     description:"By the beach",
//     price:1200,
//     location:"calanguet Goa",
//     country:"india"
// });
// await sampleListing.save();
// console.log("sample was saved")
// res.send("successful testing")
// })


 const validateListing=(req,res,next)=>{
  let{error}=listingSchema.validate(req.body);
    if( error){
      let errMsg=error.details.map((el)=> el.message.join(","));
      throw new  ExpressError(400,errMsg)
    }else{
      next();
    }
 }

// INDEX ROUTE
app.get("/listings", async (req, res) => {
  // console.log(`GET /listings - req.path: ${req.path}`);
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
});
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs", { alllistings });
  })
);

// NEW ROUTE
app.get("/listings/new", (req, res) => {
  // console.log(`GET /listings/new - req.path: ${req.path}`);
  res.render("listings/new.ejs");
});
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
  // console.log(`GET /listings/:id - req.path: ${req.path}, req.params:`, req.params);
  let { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    // console.log("error",err);
    res.render("404.ejs");
  }
});
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
  "/listings",validateListing,
  wrapAsync(async (req, res, next) => {
    
    // console.log(`POST /listings - req.path: ${req.path}`);

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
//  EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
  // console.log(`GET /listings/:id/edit - req.path: ${req.path}, req.params:`, req.params);
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});


app.put("/listings/:id",validateListing, wrapAsync( async (req, res) => {
 
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
})
);

// DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
  console.log(
    `DELETE /listings/:id - req.path: ${req.path}, req.params:`,
    req.params
  );
  let { id } = req.params;
  let deletedLsting = await Listing.findByIdAndDelete(id);
  console.log(deletedLsting);
  res.redirect("/listings");
});

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
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log(`server is listening to port at port 8080`);
});
