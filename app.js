const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const User = require("./models/user");
const seedDB = require("./seeds");

// Mongodb: connect to the database
mongoose.connect(
    "mongodb://localhost:27017/yelp_camp_2",
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

// add middleware for storing logged in user info
app.use((req, res, next) => {
    res.locals.loggedInUser = req.user;
    next();
});

// configure routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on ${port}`));
