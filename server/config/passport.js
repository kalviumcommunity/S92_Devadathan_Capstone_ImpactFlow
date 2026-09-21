const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({
          googleId: profile.id
        });

        if (!user) {
          user = await User.findOne({ email });
        }

        if (!user) {
          user = new User({
            username: email,
            googleId: profile.id,
            name: profile.displayName,
            email
          });

          await user.save();
        } else {
          user.googleId = profile.id;
          user.name = profile.displayName;
          user.email = email;

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;