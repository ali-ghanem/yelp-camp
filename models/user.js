const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String }
});

// add authenticaion functions to the user schema
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
