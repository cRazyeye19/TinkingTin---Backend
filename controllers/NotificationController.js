import NotifModel from "../models/notifModel.js";

export const createNotif = async (req, res) => {
    // create a new notification from the request body
    const newNotif = new NotifModel(req.body);
    try {
        // attempt to save the new notification to the database
        await newNotif.save();
        // if successful, return the new notification with a 200 status
        res.status(200).json(newNotif);
    } catch (error) {
        // if there is an error, return the error with a 500 status
        res.status(500).json(error);
    }
}

export const getNotifs = async (req, res) => {
    // attempt to fetch all notifications from the database
    try {
        const notifications = await NotifModel.find();
        // if successful, return all notifications with a 200 status
        res.status(200).json(notifications);
    } catch (error) {
        // if there is an error, return the error with a 500 status
        res.status(500).json(error);
    }
}

export const deleteNotif = async (req, res) => {
    // get the id of the notification to delete from the request params
    const id = req.params.id;
    try {
        // attempt to find the notification with the given id
        const notification = await NotifModel.findById(id);
        // if the notification does not exist, return a 404 status with
        // the message "Notification not found"
        if (!notification) {
            res.status(404).json("Notification not found");
        }
        // if the notification exists, attempt to delete it from the database
        const deleteNotif = await NotifModel.findByIdAndDelete(id);
        // if successful, return the deleted notification with a 200 status
        res.status(200).json(deleteNotif);
    } catch (error) {
        // if there is an error, return the error with a 500 status
        res.status(500).json(error);
    }
}