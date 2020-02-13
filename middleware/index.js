const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {};

// loggedIn middleware
middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

// authorization middleware for campground
middlewareObj.isCampgroundAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findOne({ _id: req.params.id }, (err, foundCampground) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

// authorization middleware for comment
middlewareObj.isCommentAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findOne({ _id: req.params.comment_id }, (err, foundComment) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;
