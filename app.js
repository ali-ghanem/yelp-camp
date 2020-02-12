const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Campground = require("./models/campground");
const Comment = require("./models/comment");
const User = require("./models/user");
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

// use built-in middleware to parse the requests
app.use(express.urlencoded({ extended: true }));

// set static files directory
app.use(express.static(__dirname + "/public"));

// Views extensions
app.set("view engine", "ejs");

// Passport Configuration
app.use(
    require("express-session")({
        secret: "secret for yelp-camp",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.post("/campgrounds/:id/comments", (req, res) => {
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

// =============
// AUTH ROUTES
// =============

// show register form
app.get("/register", (req, res) => {
    res.render("register");
});
// sign up logic
app.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});
// show login form
app.get("/login", (req, res) => {
    res.render("login");
});
// login logic
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),
    (req, res) => {}
);

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on ${port}`));
