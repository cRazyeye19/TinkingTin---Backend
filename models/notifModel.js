import mongoose from "mongoose";

const NotifSchema = mongoose.Schema({
    senderName: {
        type: String,
        required: true
    },
    receiverFirstName: {
        type: String,
        required: true
    },
    receiverLastName: {
        type: String,
        required: true
    },
    notification: {
        type: String,
        required: true
    },
    context : String
}, {
    timestamps: true
})

const NotifModel = mongoose.model('Notif', NotifSchema);
export default NotifModel