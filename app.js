const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const configs = require("./configs/globals"); 
require("./configs/passport"); 
require('dotenv').config();

// Create an instance of the express application
const app = express();

// Set up mongoose connection
mongoose
  .connect(configs.ConnectionStrings.MongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected Successfully!"))
  .catch((error) => console.log(`Error while connecting: ${error}`));

// Set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Register the Handlebars helpers
const hbs = require("hbs");
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("toShortDate", (longDateValue) => {
  return new hbs.SafeString(new Date(longDateValue).toLocaleDateString("en-CA"));
});

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Set up session and passport
app.use(
  session({
    secret: "s2021pr0j3ctTracker",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routers
const indexRouter = require("./routes/index");
const projectsRouter = require("./routes/projects");
const coursesRouter = require("./routes/courses");

// Register routers
app.use("/", indexRouter);
app.use("/projects", projectsRouter);
app.use("/courses", coursesRouter);

// Error Handling Middleware
app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
