const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
            let usersCampgrounds = {};
            Campground.find({}, (err, campgrounds) => {
                if (err) {
                    console.log(err);
                } else {
                    campgrounds.forEach(camp => {
                        if (usersCampgrounds[camp.author]) {
                            usersCampgrounds[camp.author] += 1;
                        } else {
                            usersCampgrounds[camp.author] = 1;
                        }
                    });
                    res.render("users/index", { users, usersCampgrounds });
                }
            });
        }
    });
});

router.get("/:id", (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            Campground.find({})
                .where("author")
                .equals(user._id)
                .exec((err, campgrounds) => {
                    if (err) {
                        console.log(err);
                    }
                    res.render("users/show", { user, campgrounds });
                });
        }
    });
});

// show Edit page
router.get("/:id/edit", middleware.isUser, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            res.render("users/edit", { user });
        }
    });
});

// Edit User
router.put("/:id", middleware.isUser, (req, res) => {
    const { firstName, lastName, username, photo } = req.body;
    User.findOneAndUpdate(
        { _id: req.params.id },
        { firstName, lastName, username, photo },
        (err, updatedUser) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                res.redirect("/users/" + req.params.id);
            }
        }
    );
});

module.exports = router;
