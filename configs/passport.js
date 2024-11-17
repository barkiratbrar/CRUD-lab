const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const configs = require("../configs/globals");
const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: configs.Authentication.Google.ClientId,
      clientSecret: configs.Authentication.Google.ClientSecret,
      callbackURL: configs.Authentication.Google.CallbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ oauthId: profile.id });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            oauthId: profile.id,
            oauthProvider: "Google",
            created: Date.now(),
          });
          const savedUser = await newUser.save();
          return done(null, savedUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
