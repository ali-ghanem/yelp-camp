const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    photo: String
});

// add authenticaion functions to the user schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);