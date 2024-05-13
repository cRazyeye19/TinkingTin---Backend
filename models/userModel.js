import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required : true,
        default: false
    },
    role: {
        type: String,
        default: "User"
    },
    department: {
        type: String,
        default: "None"
    },
    profilePicture : String,
    job: String,
    schoolId: String,
},
{
    timestamps: true
})

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel