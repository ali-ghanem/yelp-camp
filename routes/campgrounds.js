const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// GET All Campgrounds
router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            res.render("campgrounds/index", { campgrounds });
        }
    });
});

// Create New Campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

// POST New Campground
router.post("/", middleware.isLoggedIn, (req, res) => {
    let {
        name,
        image,
        price,
        contactPhone,
        contactEmail,
        description
    } = req.body;

    if (!image) {
        image = "https://clipartart.com/images/a-person-camping-clipart.gif";
    }

    const author = req.user._id;
    const newCampground = {
        name,
        image,
        price,
        contactPhone,
        contactEmail,
        description,
        author
    };
    Campground.create(newCampground, (err, campground) => {
        if (err) {
            req.flash("error", err.message);
        }
        res.redirect("/campgrounds");
    });
});

// GET One Campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id)
        .populate("author")
        .populate({
            path: "comments",
            populate: {
                path: "author"
            }
        })
        .exec((err, camp) => {
            if (err) {
                req.flash("error", err.message);
            }
            res.render("campgrounds/show", { campground: camp });
        });
});

// Show Edit Campground Page
router.get("/:id/edit", middleware.isCampgroundAuthor, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", { campground });
        }
    });
});

// Edit Campground
router.put("/:id", middleware.isCampgroundAuthor, (req, res) => {
    let {
        name,
        image,
        contactPhone,
        contactEmail,
        price,
        description
    } = req.body.campground;

    if (!image) {
        image = "https://clipartart.com/images/a-person-camping-clipart.gif";
    }

    Campground.findOneAndUpdate(
        { _id: req.params.id },
        {
            name,
            image,
            contactPhone,
            contactEmail,
            price,
            description
        },
        (err, updatedCampground) => {
            if (err) {
                req.flash("error", err.message);
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
            req.flash("error", err.message);
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
            comment.author = req.user._id;
            await comment.save();
            camp.comments.push(comment);
            await camp.save();
            res.redirect(`/campgrounds/${req.params.id}#${comment._id}`);
        });
    } catch (error) {
        req.flash("error", error);
        res.redirect("back");
    }
});

// Edit Comment
router.put(
    "/:id/comments/:comment_id",
    middleware.isCommentAuthor,
    (req, res) => {
        try {
            Comment.findOneAndUpdate(
                { _id: req.params.comment_id },
                { text: req.body.comment },
                (err, comment) => {
                    res.redirect(`/campgrounds/${req.params.id}#${req.params.comment_id}`);
                }
            );
        } catch (error) {
            req.flash("error", error);
            res.redirect("back");
        }
    }
);

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
            req.flash("error", error);
            res.redirect("back");
        }
    }
);

module.exports = router;
