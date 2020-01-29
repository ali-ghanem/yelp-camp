// Express
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

// Views extensions
app.set("view engine", "ejs");

// Mongodb
const mongoose = require("mongoose");
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

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// Campground.insertMany(
//     {
//         name: "Campground 1",
//         image:
//             "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"
//     }, (err, campground) => {
//         if(err){
//             console.log(err)
//         } else{
//             console.log("NEWLY CREATED CAMPGROUND")
//             console.log(campground)
//         }
//     })

// let campgrounds = [
//     {
//         name: "Campground 1",
//         image:
//             "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"
//     },
//     {
//         name: "Campground 2",
//         image:
//             "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774__340.jpg"
//     },
//     {
//         name: "Campground 3",
//         image:
//             "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"
//     }
// ];

// Landing Page
app.get("/", (req, res) => {
    res.render("landing");
});

// GET All Campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if(err){
            console.log(err)
        } else{
            console.log(campgrounds)
            res.render("campgrounds", { campgrounds: campgrounds });
        }
    })
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
    let newCampground = { name: name, image: image };
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on ${port}`));
