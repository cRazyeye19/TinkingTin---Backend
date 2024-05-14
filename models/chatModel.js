import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/9790/9790561.png"
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
}, {
    timestamps: true
})

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel