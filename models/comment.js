const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    createdDate: { type: Date, default: Date.now },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Comment", commentSchema);
