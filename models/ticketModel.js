import mongoose from "mongoose";

const TicketSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    userfirstname: {
        type: String,
        required: true
    },
    userlastname: {
        type: String,
        required: true
    },
    issue: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Open"
    },
    department: {
        type: String,
    },
    assignee: {
        type: [String],
        required: true,
        default: []
    },
    priority: {
        type: String,
        required: true
    },
    maxTime: {
        type: Number,
        required: true,
        default: 0
    },
    minTime: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: [String],
        ref: "Comment"
    }
},
    {
        timestamps: true
    })

const TicketModel = mongoose.model("Ticket", TicketSchema);
export default TicketModel