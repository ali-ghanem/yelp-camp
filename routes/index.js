const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Landing Page
router.get("/", (req, res) => {
    res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
    res.render("register");
});
// sign up logic
router.post("/register", (req, res) => {
    let { firstName, lastName, username, password, photo } = req.body;

    // set default photo
    if (!photo) {
        photo = "/img/default_photos/profile-photo.png";
    }

    let newUser = new User({ firstName, lastName, username, photo });
    User.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.firstName);
            res.redirect("/campgrounds");
        });
    });
});
// show login form
router.get("/login", (req, res) => {
    res.render("login");
});
// login logic
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {}
);

// logout
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/campgrounds");
});

module.exports = router;
