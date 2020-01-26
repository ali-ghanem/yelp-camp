const express = require("express")
const app = express()

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("landing")
})

app.get("/campgrounds", (req, res) => {
    let campgrounds = [
        {name: "Campground 1", image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg"},
        {name: "Campground 2", image: "https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c722672d69f4ac25d_340.jpg"},
        {name: "Campground 3", image: "https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c722672d69f4ac25d_340.jpg"}
    ]
    res.render("campgrounds", {campgrounds: campgrounds})
})

app.listen(5500, "127.0.0.1", () => {
    console.log("Server is running")
})