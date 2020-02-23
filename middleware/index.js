const Campground = require("../models/campground");
const Comment = require("../models/comment");
const User = require("../models/user");

const middlewareObj = {};

// loggedIn middleware
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
};

// authorization middleware for user
middlewareObj.isUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        User.findOne({ _id: req.params.id }, (err, foundUser) => {
            if (err || !foundUser) {
                console.log(err);
                req.flash("error", "User not found");
                res.redirect("/users");
            } else {
                if (foundUser._id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash(
                        "error",
                        "You do not have permission to do that."
                    );
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First");
        res.redirect("/users");
    }
};

// authorization middleware for campground
middlewareObj.isCampgroundAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findOne({ _id: req.params.id }, (err, foundCampground) => {
            if (err || !foundCampground) {
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                if (foundCampground.author.equals(req.user._id)) {
                    next();
                } else {
                    req.flash(
                        "error",
                        "You do not have permission to do that."
                    );
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please Login First");
        res.redirect("/campgrounds");
    }
};

// authorization middleware for comment
middlewareObj.isCommentAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findOne({ _id: req.params._id }, (err, foundCampground) => {
            if (err || !foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                Comment.findOne(
                    { _id: req.params.comment_id },
                    (err, foundComment) => {
                        if (err || !foundComment) {
                            console.log(err);
                            req.flash("error", "Comment not found");
                            res.redirect("/campgrounds/" + req.params.id);
                        } else {
                            if (foundComment.author.equals(req.user._id)) {
                                next();
                            } else {
                                req.flash(
                                    "error",
                                    "You do not have permission to do that."
                                );
                                res.redirect("back");
                            }
                        }
                    }
                );
            }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;
