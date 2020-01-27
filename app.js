const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}))

app.set("view engine", "ejs");

let campgrounds = [
    {
        name: "Campground 1",
        image:
            "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"
    },
    {
        name: "Campground 2",
        image:
            "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774__340.jpg"
    },
    {
        name: "Campground 3",
        image:
            "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg"
    }
];

// Landing Page
app.get("/", (req, res) => {
    res.render("landing");
});

// GET All Campgrounds
app.get("/campgrounds", (req, res) => {
    res.render("campgrounds", { campgrounds: campgrounds });
});

// Start the Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on ${port}`));
