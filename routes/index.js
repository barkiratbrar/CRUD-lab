const express = require("express");
const router = express.Router();
const passport = require("passport");

// GET home page
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", user: req.user });
});

// GET /login
router.get("/login", (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { title: "Login", messages: messages, user: req.user });
});

// POST /login
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/projects",
    failureRedirect: "/login",
    failureMessage: "Invalid credentials",
  })
);

// GET /register
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create a new account", user: req.user });
});

// POST /register
router.post("/register", (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect("/register");
      } else {
        req.login(newUser, (err) => {
          res.redirect("/projects");
        });
      }
    }
  );
});

// GET /logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// GET /google - Trigger Google OAuth login
router.get("/google", (req, res, next) => {
  console.log("Google OAuth login initiated");
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// GET /google/callback - Handle the Google OAuth callback
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Handling Google OAuth callback");
    passport.authenticate("google", (err, user, info) => {
      if (err) {
        console.error("Error during Google OAuth:", err);
        return res.redirect("/login");
      }
      if (!user) {
        console.error("User not found during Google OAuth");
        return res.redirect("/login");
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error("Error logging in user after Google OAuth:", loginErr);
          return res.redirect("/login");
        }
        // Successful authentication
        console.log("Google OAuth successful, redirecting to /projects");
        res.redirect("/projects");
      });
    })(req, res, next);
  }
);

module.exports = router;
