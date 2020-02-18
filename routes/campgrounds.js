const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

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
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

// POST New Campground
router.post("/", middleware.isLoggedIn, (req, res) => {
    let { name, image, price, contactPhone, contactEmail, description } = req.body;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    price = Number(price).toFixed(2);
    const newCampground = { name, image, price, contactPhone, contactEmail, description, author };
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
router.get("/:id/edit", middleware.isCampgroundAuthor, (req, res) => {
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
router.put("/:id", middleware.isCampgroundAuthor, (req, res) => {
    const { name, image, price, description } = req.body.campground;
    Campground.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { name, image, price, description } },
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
router.delete("/:id", middleware.isCampgroundAuthor, (req, res) => {
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
router.post("/:id/comments", middleware.isLoggedIn, (req, res) => {
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

// DELETE Comment
router.delete(
    "/:id/comments/:comment_id",
    middleware.isCommentAuthor,
    (req, res) => {
        try {
            Comment.findOne({ _id: req.params.comment_id }, (err, comment) => {
                comment.remove();
                res.redirect("/campgrounds/" + req.params.id + "#comment");
            });
        } catch (error) {
            console.log(err);
            res.redirect("back");
        }
    }
);

module.exports = router;
