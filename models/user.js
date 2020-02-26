const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Campground = require("./campground");

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    photo: { type: String }
});

// add authenticaion functions to the user schema
userSchema.plugin(passportLocalMongoose);

// Remove all associated campgrounds when removing user
userSchema.pre("remove", async function() {
    try {
        await Campground.deleteMany({
            author: this._id
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = mongoose.model("User", userSchema);
