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
            res.render("campgrounds", { campgrounds: campgrounds });
        }
    });
});

// Create New Campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render("new.ejs");
});

// POST New Campground
router.post("/", isLoggedIn, (req, res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = { name, image, description };
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//GET One Campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
        .populate("comments")
        .exec((err, camp) => {
            if (err) {
                console.log(err);
            } else {
                res.render("show", { campground: camp });
            }
        });
});

// POST Comment
router.post("/:id/comments", isLoggedIn, (req, res) => {
    try {
        Campground.findById(req.params.id, async (err, camp) => {
            let comment = await Comment.create(req.body.comment);
            camp.comments.push(comment);
            camp.save();
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

module.exports = router;