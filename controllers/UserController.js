import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// This controller function handles GET requests for a specific user by their ID.
// It takes in a request object and a response object as parameters.
export const getUser = async (req, res) => {

    // Extract the ID from the request parameters.
    const id = req.params.id;

    try {

        // Use the UserModel to find the user with the matching ID.
        const user = await UserModel.findById(id);

        // If the user was found, extract the password field and send the rest of the user details.
        if (user) {

            const { password, ...others } = user._doc;
            res.status(200).json(others);

        }
        // If the user was not found, send a 404 response with an error message.
        else {

            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {

        // If an error occurred, send a 500 response with an error message.
        res.status(500).json({ message: error.message });
    }
}

// This controller function handles GET requests for all users.
export const getAllUsers = async (req, res) => {
    try {
        // Use the UserModel to find all users.
        const users = await UserModel.find();
        // For each user, extract the password field and send the rest of the user details.
        const sanitizedUsers = users.map(user => {
            const { password, ...otherDetails } = user._doc;
            return otherDetails;
        });
        // Send a 200 response with the user details.
        res.status(200).json(sanitizedUsers);
    } catch (error) {
        // If an error occurred, send a 500 response with an error message.
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// This controller function handles PUT requests to update a user.
export const updateUser = async (req, res) => {

    // Extract the ID from the request parameters.
    const id = req.params.id;

    try {
        // Use the UserModel to find and update the user with the matching ID.
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        // Generate a JSON Web Token (JWT) with the user's username and ID.
        const token = jwt.sign(
            { username: user.username, id: user._id },
            process.env.JWT_KEY, { expiresIn: "1h" }
        )
        // Send a 200 response with the updated user and the JWT.
        res.status(200).json({ user, token });

    } catch (error) {
        // If an error occurred, send a 500 response with an error message.
        res.status(500).json({ message: error.message });
    }
}

// This controller function handles PUT requests to update a user's assignee field.
export const updateAssignee = async (req, res) => {

    // Extract the ID from the request parameters.
    const id = req.params.id;

    try {
        // Use the UserModel to find and update the user with the matching ID.
        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        // If the user was not found, send a 404 response with an error message.
        if(!user) return res.status(404).json({ message: "User not found" });

        // Use the UserModel to find and update the user with the matching ID.
        const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true });
        
        // Send a 200 response with the updated user.
        res.status(200).json(updatedUser);
    }catch (error) {
        // If an error occurred, send a 500 response with an error message.
        res.status(500).json({ message: error.message });
    }
}

// This controller function handles DELETE requests to delete a user.
export const deleteUser = async (req, res) => {

    // Extract the ID from the request parameters.
    const id = req.params.id;
    // Extract the current user ID and role from the request body.
    const { currentUserId, role } = req.body;

    // If the user ID matches the current user ID or the role is "Admin", proceed to delete the user.
    if (id === currentUserId || role === "Admin") {
        try {

            // Use the UserModel to find and delete the user with the matching ID.
            await UserModel.findByIdAndDelete(id);
            // Send a 200 response with a success message.
            res.status(200).json("User deleted successfully");

        } catch (error) {

            // If an error occurred, send a 500 response with an error message.
            res.status(500).json({ message: error.message });
        }
    }
    // If the user ID does not match the current user ID and the role is not "Admin", send a 403 response with an error message.
    else {

        res.status(403).json({ message: "Access Denied" });
    }
}