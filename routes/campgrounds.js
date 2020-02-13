const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// GET All Campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});

// Create New Campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

// POST New Campground
router.post("/", isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = { name, image, description, author };
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// GET One Campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, camp) => {
            if (err) {
                console.log(err);
            } else {
                res.render("campgrounds/show", { campground: camp });
            }
        });
});

// Show Edit Campground Page
router.get("/:id/edit", isOwner, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", { campground });
        }
    });
});

// Edit Campground
router.put("/:id", isOwner, (req, res) => {
    Campground.findOneAndUpdate(
        req.params.id,
        req.body.campground,
        (err, updatedCampground) => {
            if (err) {
                console.log(err);
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        }
    );
});

// Delete Campground
router.delete("/:id", isOwner, (req, res) => {
    Campground.findOne({ _id: req.params.id }, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            campground.remove();
            res.redirect("/campgrounds");
        }
    });
});

// POST Comment
router.post("/:id/comments", isLoggedIn, (req, res) => {
    try {
        Campground.findById(req.params.id, async (err, camp) => {
            let comment = await Comment.create(req.body.comment);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            await comment.save();
            camp.comments.push(comment);
            await camp.save();
            res.redirect("/campgrounds/" + camp._id + "#comment");
        });
    } catch (error) {
        console.log(error);
    }
});

// loggedIn middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// authorization middleware
function isOwner(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findOne({ _id: req.params.id }, (err, founcCampground) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (founcCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;
