const express = require("express")
const app = express()

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("landing")
})

app.listen(5500, "127.0.0.1", () => {
    console.log("Server is running")
})