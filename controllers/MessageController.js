import ChatModel from '../models/chatModel.js';
import UserModel from '../models/userModel.js';
import MessageModel from '../models/messageModel.js';
export const sendMessage = async (req, res) => {
    const { chatId, message } = req.body;
    try {
        let msg = await MessageModel.create({
            sender: req.user._id,
            message,
            chatId
        })
        msg = await msg.populate("sender", "username, profilePicture, firstname, lastname")
            .populate({
                path: "chatId",
                select: "chatName isGroupChat users",
                model: "Chat",
                populate: {
                    path: "users",
                    select: "username profilePicture firstname lastname",
                    model: "Users",
                },
            });
        await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage: msg,
        });
        res.status(200).json(msg);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export const getMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        let messages = await MessageModel.find({ chatId })
            .populate({
                path: "sender",
                select: "username profilePicture firstname lastname",
                model: "Users",
            })
            .populate({
                path: "chatId",
                model: "Chat",
            });
        res.status(200).json(messages);
    } catch (error) {
        res.sendStatus(500);
        console.log(error);
    }
}