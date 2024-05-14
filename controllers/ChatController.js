import ChatModel from '../models/chatModel.js';
import UserModel from '../models/userModel.js';

export const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        res.send({ message: "UserId param not sent with request" });
    }

    let chatExists = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage");
    chatExists = await UserModel.populate(chatExists, {
        path: "latestMessage.sender",
        select: "username firstname lastname profilePicture",
    })

    if (chatExists.length > 0) {
        res.send(chatExists[0]);
    } else {
        let data = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const newChat = await ChatModel.create(data);
            const chat = await ChatModel.findOne({ _id: newChat._id }).populate("users", "-password");
            res.status(200).send(chat);
        } catch (error) {
            res.sendStatus(500);
            console.log(error);
        }
    }
}

export const fetchChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
        const finalChats = await UserModel.populate(chats, {
            path: "latestMessage.sender",
            select: "username firstname lastname profilePicture",
        })
        res.status(200).json(finalChats);
    } catch (error) {
        res.status(500);
        console.log(error);
    }
}

export const createGroupChat = async (req, res) => {
    const { chatName, users } = req.body;
    if (!chatName || !users) {
        return res.status(400).send({ message: "Please fill all the fields" });
    }
    const parsedUsers = JSON.parse(users);
    if (parsedUsers.length < 2) {
        return res.status(400).send({ message: "More than 2 users are required to form a group chat" });
    }
    parsedUsers.push(req.user);
    try {
        const groupChat = await ChatModel.create({
            chatName: chatName,
            users: parsedUsers,
            isGroupChat: true,
            groupAdmin: req.user._id,
        });
        const createdChat = await ChatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.send(createdChat);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
}

export const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
        res.status(400).send({ message: "Please fill all the fields" });
    }
    try {
        const chat = await ChatModel.findByIdAndUpdate(chatId, {
            $set: { chatName },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!chat) {
            res.status(404);
            throw new Error("Chat Not Found");
        }
        res.send(chat);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
}

export const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    const existing = await ChatModel.findOne({ _id: chatId });
    if (!existing.users.includes(userId)) {
        const chat = await ChatModel.findByIdAndUpdate(chatId, {
            $push: { users: userId },
        })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        if (!chat) {
            res.status(404);
        }
        res.status(200).send(chat);
    } else {
        res.status(409).send('user already exists');
    }
}

export const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    const existing = await ChatModel.findOne({ _id: chatId });
    if (existing.users.includes(userId)) {
        ChatModel.findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        })
            .populate("groupAdmin", "-password")
            .populate("users", "-password")
            .then((e) => res.status(200).send(e))
            .catch((e) => res.status(404));
    } else {
        res.status(409).send('user not found');
    }
}