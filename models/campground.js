const mongoose = require("mongoose");
const Comment = require("./comment");

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Remove all associated comments when removing a campground
campgroundSchema.pre("remove", async function() {
    try {
        await Comment.deleteMany({
            _id: {
                $in: this.comments
            }
        }); 
    } catch (error) {
        console.log(error);
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);
