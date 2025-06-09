// console.log("Server starting lalala");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wandurlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const fs = require("fs");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js")
const session = require("express-session");
const flash=require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")

async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+1000*60*60*24*3,
    maxAge:1000*60*60*24*3,
    httpOnly:true
  }
};

app.get("/",(req,res)=>{
  res.send("Hi I am root")
})

app.use(session(sessionOptions))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success")
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter)
// New middleware to handle static file 404s
app.use((req, res, next) => {
  if (
    req.method === "GET" &&
    !req.url.startsWith("/listings/") &&
    !req.url.startsWith("/")
  ) {
    const filePath = path.join(__dirname, "public", req.url);
    if (!fs.existsSync(filePath)) {
      console.log(`Static file not found: ${req.url}`);
      return res.status(404).send("Static file not found");
    }
  }
  next();
});

app.get("/", (req, res) => {
  console.log(`GET / - req.path: ${req.path}`);
  res.send("working");
});



app.all("/", (req, res, next) => {
  // next(new ExpressError(404, "Page Not Found!"));
  res.render("/404.ejs");
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log(`server is listening to port at port 8080`);
});
