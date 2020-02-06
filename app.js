const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seeds");

// Mongodb: connect to the database
mongoose.connect(
    "mongodb://localhost:27017/yelp_camp",
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
        if (err) {
            console.log(err);
        } else {
            console.log("Connected Successfully");
        }
    }
);

// seeding the database
seedDB();

// Express: use built-in middleware to parse the requests
app.use(express.urlencoded({ extended: true }));

// Views extensions
app.set("view engine", "ejs");

// Landing Page
app.get("/", (req, res) => {
    res.render("landing");
});

// GET All Campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", { campgrounds: campgrounds });
        }
    });
});

// Create New Campground
app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

// POST New Campground
app.post("/campgrounds", (req, res) => {
    console.log(req.body);
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
app.get("/campgrounds/:id", (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campground: campground });
        }
    });
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on ${port}`));
