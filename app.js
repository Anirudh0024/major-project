if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dbURL = process.env.ATLASDB_URL;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const fs = require("fs");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

async function main() {
  await mongoose.connect(dbURL);
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
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR in mongoose session store", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
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
  res.render("home");
});

// app.get("/", (req, res) => {
//   console.log(`GET / - req.path: ${req.path}`);
//   res.render("/404.ejs");
// });

// app.all("/", (req, resx) => {
//   res.render("/404");
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log(`server is listening to port at port 8080`);
});
