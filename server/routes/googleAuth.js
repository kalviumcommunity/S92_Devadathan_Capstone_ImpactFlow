const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        userId: req.user._id,
        username: req.user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Google authentication successful",
      token
    });
  }
);

module.exports = router;