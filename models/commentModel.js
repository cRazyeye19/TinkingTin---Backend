import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    ticketId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    replies: [{
        username: {
            type: String,
            required: true
        },
        commentId: {
            type: String,
            required: true
        },
        reply: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date().getTime()
        }
    }]
}, {
    timestamps: true
})

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel