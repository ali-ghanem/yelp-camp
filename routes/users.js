const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Campground = require("../models/campground");
const middleware = require("../middleware");

async function getUsersCampgrounds(res) {
    try {
        let usersCampgrounds = {};
        let campgrounds = await Campground.find({});
        campgrounds.forEach(camp => {
            if (usersCampgrounds[camp.author]) {
                usersCampgrounds[camp.author] += 1;
            } else {
                usersCampgrounds[camp.author] = 1;
            }
        });
        return usersCampgrounds;
    } catch (err) {
        res.locals.error = "An error occured";
        return {};
    }
}

router.get("/", async (req, res) => {
    try {
        let users = [];
        if (req.query.search) {
            let foundUsers = await User.find(
                { $text: { $search: req.query.search } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });

            if (!foundUsers.length) {
                res.locals.error = "No results for your search";
                return res.render("users/index", {
                    users: [],
                    usersCampgrounds: {}
                });
            }

            users = foundUsers;
        } else {
            users = await User.find({});
        }

        let usersCampgrounds = await getUsersCampgrounds(res);

        res.render("users/index", { users, usersCampgrounds });
    } catch (error) {
        req.flash("error", "An error occured");
        res.redirect("/users");
    }
});

router.get("/:id", (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err || !user) {
            req.flash("error", "User not found");
            res.redirect("/users");
        } else {
            Campground.find({})
                .where("author")
                .equals(user._id)
                .exec((err, campgrounds) => {
                    if (err) {
                        req.flash("error", err.message);
                        res.redirect("/users");
                    }
                    res.render("users/show", { user, campgrounds });
                });
        }
    });
});

// show Edit page
router.get("/:id/edit", middleware.isUser, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err || !user) {
            req.flash("error", "User not found");
            res.redirect("/users");
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
                // handle error
                if (err.code === 11000) {
                    req.flash(
                        "error",
                        "A user with the given username is already registered"
                    );
                } else {
                    req.flash("error", err.message);
                }
                res.redirect("back");
            } else {
                // when success show user profile
                res.redirect("/users/" + req.params.id);
            }
        }
    );
});

// Delete User
router.delete("/:id", middleware.isUser, (req, res) => {
    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err || !user) {
            req.flash("error", "User not found");
            res.redirect("/users");
        } else {
            user.remove();
            res.redirect("/users");
        }
    });
});

module.exports = router;
