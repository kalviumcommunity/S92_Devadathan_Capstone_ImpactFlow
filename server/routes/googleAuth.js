const express = require("express");
const passport = require("../config/passport");
const { isGoogleOAuthConfigured } = require("../config/googleOAuth");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    googleConfigured:
      isGoogleOAuthConfigured() && Boolean(process.env.JWT_SECRET)
  });
});

router.get("/google", (req, res, next) => {
  if (!isGoogleOAuthConfigured()) {
    return res.status(503).json({
      message: "Google sign-in is not configured"
    });
  }

  return passport.authenticate("google", {
    scope: ["profile", "email"]
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!isGoogleOAuthConfigured()) {
      return res.status(503).json({
        message: "Google sign-in is not configured"
      });
    }

    passport.authenticate("google", { session: false }, (error, user) => {
      const clientUrl =
        process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";
      const redirectUrl = new URL("/", clientUrl);

      if (error || !user) {
        redirectUrl.hash = new URLSearchParams({
          auth_error: "google"
        }).toString();
        return res.redirect(redirectUrl.toString());
      }

      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      redirectUrl.hash = new URLSearchParams({
        token,
        name: user.name || user.username,
        email: user.email || ""
      }).toString();
      return res.redirect(redirectUrl.toString());
    })(req, res, next);
  }
);

module.exports = router;