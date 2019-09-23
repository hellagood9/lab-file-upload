const express = require("express");
const router = express.Router();
const postRoutes = require("./post-routes");
const User = require("../models/User");
const passport = require("passport");

router.use("/", postRoutes);

/* GET home page */

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    res.render("auth/profile", { user });
  })
});

module.exports = router;
