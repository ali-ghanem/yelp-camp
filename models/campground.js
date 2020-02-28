const mongoose = require("mongoose");
const Comment = require("./comment");

let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    createdDate: { type: Date, default: Date.now },
    country: String,
    city: String,
    description: String,
    contactPhone: String,
    contactEmail: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

campgroundSchema.index({ name: "text", description: "text" });

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
