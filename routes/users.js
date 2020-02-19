const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Campground = require("../models/campground");

router.get("/", (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
        } else {
            let usersCampgrounds = {};
            Campground.find({}, (err, campgrounds) => {
                if(err){
                    console.log(err);
                } else {
                    campgrounds.forEach(camp => {
                        if(usersCampgrounds[camp.author]) {
                            usersCampgrounds[camp.author] += 1
                        } else {
                            usersCampgrounds[camp.author] = 1
                        }
                    })
                    res.render("users/index", { users, usersCampgrounds });
                }
            })
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

module.exports = router;
