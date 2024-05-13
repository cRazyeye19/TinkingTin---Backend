import ChatModel from '../models/chatModel.js';
import UserModel from '../models/userModel.js';

export const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.sendStatus(400);
    }

    var isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");
    isChat = await UserModel.populate(isChat, {
        path: "latestMessage.sender",
        select: "username firstname lastname profilePicture",
    })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await ChatModel.create(chatData);
            const FullChat = await ChatModel.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        } catch (error) {
            res.sendStatus(400);
        }
    }
}

export const fetchChats = async (req, res) => {
    try {
        ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await UserModel.populate(results, {
                    path: "latestMessage.sender",
                    select: "username firstname lastname profilePicture",
                })
                res.status(200).send(results);
            })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

export const createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the fields" });
    }

    var users = JSON.parse(req.body.users); // Parse the users array if it's a string

    if (!Array.isArray(users) || users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    // Assuming each user is represented by their MongoDB ObjectId as a string
    users.push(req.user);

    try {
        const groupChat = await ChatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}