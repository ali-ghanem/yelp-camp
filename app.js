const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const indexRoutes = require("./routes/index");
const campgroundRoutes = require("./routes/campgrounds");
const usersRoutes = require("./routes/users");
const User = require("./models/user");
const seedDB = require("./seeds");

// Mongodb: connect to the database
const URL = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_3";
mongoose.connect(
    URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
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

app.use(methodOverride("_method"));

// Views extensions
app.set("view engine", "ejs");

// Flash Messages
app.use(flash());

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
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// configure routes
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/users", usersRoutes);

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is started`));
