const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// GET All Campgrounds
router.get("/", (req, res) => {
    if (req.query.search) {
        Campground.find(
            { $text: { $search: req.query.search } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })
            .exec((err, campgrounds) => {
                if (err || !campgrounds.length) {
                    req.flash("error", "No results for your search");
                    res.redirect("/campgrounds");
                } else {
                    res.render("campgrounds/index", { campgrounds });
                }
            });
    } else {
        Campground.find({}, (err, campgrounds) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/");
            } else {
                res.render("campgrounds/index", { campgrounds });
            }
        });
    }
});

router.get("/filter", (req, res) => {
    let { country, city, minPrice, maxPrice } = req.query;

    let conditions = {};

    if (country) {
        conditions.country = country;
    }
    if (city) {
        conditions.city = city;
    }
    if (minPrice && maxPrice) {
        conditions.$and = [
            { price: { $gte: minPrice } },
            { price: { $lte: maxPrice } }
        ];
    } else if (minPrice && !maxPrice) {
        conditions.price = { $gte: minPrice };
    } else if (maxPrice) {
        conditions.price = { $lte: maxPrice };
    }

    Campground.find(conditions, (err, campgrounds) => {
        if (err || !campgrounds.length) {
            req.flash("error", "No results for your filter");
            res.redirect("/campgrounds");
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
        country,
        city,
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
        country,
        city,
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
        .exec((err, campground) => {
            if (err || !campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                res.render("campgrounds/show", { campground });
            }
        });
});

// Show Edit Campground Page
router.get("/:id/edit", middleware.isCampgroundAuthor, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Campground not found");
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
            if (err || !updatedCampground) {
                req.flash("error", "Campground not found");
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
        Campground.findById(req.params.id, async (err, campground) => {
            if (err || !campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                let comment = await Comment.create(req.body.comment);
                comment.author = req.user._id;
                await comment.save();
                campground.comments.push(comment);
                await campground.save();
                res.redirect(`/campgrounds/${req.params.id}#${comment._id}`);
            }
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
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect(
                            `/campgrounds/${req.params.id}#${comment._id}`
                        );
                    }
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
                if (err || !comment) {
                    req.flash("error", "Comment not found");
                    res.redirect("/campgrounds/" + req.params.id);
                } else {
                    comment.remove();
                    res.redirect("/campgrounds/" + req.params.id + "#comment");
                }
            });
        } catch (error) {
            req.flash("error", error);
            res.redirect("back");
        }
    }
);

module.exports = router;
