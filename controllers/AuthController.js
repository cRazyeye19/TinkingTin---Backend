import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';

/**
 * Registers a new user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const registerUser = async (req, res) => {
    try {
        // Generate a salt for password hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the user's password using the generated salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Replace the user's password in the request body with the hashed password
        req.body.password = hashedPassword;

        // Create a new UserModel instance with the request body
        const newUser = new UserModel(req.body);

        // Check if a user with the same username already exists
        const { username } = req.body;
        const oldUser = await UserModel.findOne({ username });

        if (oldUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Save the new user to the database
        const user = await newUser.save();

        // Generate a JSON Web Token (JWT) for authenticating the user
        const token = jwt.sign({
            username: user.username,
            id: user._id
        }, process.env.JWT_KEY, { expiresIn: "1h" });

        // Respond with the user object and the generated token
        res.status(200).json({ user, token });
    } catch (error) {
        // Respond with an error message if an error occurs
        res.status(500).json({ message: error.message });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
                { firstname: { $regex: req.query.search, $options: "i" } },
                { lastname: { $regex: req.query.search, $options: "i" } }
            ]
        } : {};

        const users = await UserModel.find({ _id: { $ne: req.user._id }, ...keyword }).select("-password");
        res.send(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/**
 * Logs in a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find a user with the given username in the database
        const user = await UserModel.findOne({ username: username });

        if (user) {
            // Verify the user's password
            const validity = await bcrypt.compare(password, user.password);

            if (!validity) {
                res.status(400).json("Wrong Password");
            } else {
                // Generate a JSON Web Token (JWT) for authenticating the user
                const token = jwt.sign({
                    username: user.username,
                    id: user._id
                }, process.env.JWT_KEY, { expiresIn: "1h" });

                // Respond with the user object and the generated token
                res.status(200).json({ user, token });
            }
        } else {
            // Respond with an error message if the user is not found
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        // Respond with an error message if an error occurs
        res.status(500).json({ message: error.message });
    }
}

/**
 * Sends a password reset email to the user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const resetPass = async (req, res) => {
    try {
        const { username } = req.body;

        // Find a user with the given username in the database
        const user = await UserModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a JSON Web Token (JWT) for authenticating the password reset request
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1h" });

        // Set up the email transporter
        let transporter;
        let mailOptions;

        // Check if the email domain is Gmail
        if (user.username.endsWith('@gmail.com')) {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'jlester.business.co@gmail.com',
                    pass: process.env.GMAIL_PASSWORD
                }
            });

            mailOptions = {
                from: 'jlester.business.co@gmail.com',
                to: user.username,
                subject: 'TinkingTin || Reset Password',
                html: `
                <p>Dear User,</p>
                <p>Please click on the following link to reset your password:</p>
                <p><a href="http://localhost:3000/reset-password/${user._id}/${token}">Reset Password</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Note: This link will expire in 1 hour.</p>
            `
            };
        }
        // Check if the email domain is Outlook
        else if (user.username.endsWith('@cit.edu')) {
            transporter = nodemailer.createTransport({
                host: "smtp-mail.outlook.com",
                port: 587,
                secure: false,
                auth: {
                    user: 'johnlester.pansoy@cit.edu',
                    pass: process.env.OUTLOOK_PASSWORD
                }
            });

            mailOptions = {
                from: 'johnlester.pansoy@cit.edu',
                to: user.username,
                subject: 'TinkingTin || Reset Password',
                html: `
                <p>Dear User,</p>
                <p>Please click on the following link to reset your password:</p>
                <p><a href="http://localhost:3000/reset-password/${user._id}/${token}">Reset Password</a></p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Note: This link will expire in 1 hour.</p>
            `
            };
        }
        else {
            // Return an error if the email domain is neither Gmail nor Outlook
            return res.status(400).json({ message: "Unsupported email domain" });
        }

        // Send the email using the determined transporter
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * Resets the user's password.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const forgotPass = async (req, res) => {
    try {
        const { id, token } = req.params;
        const { password } = req.body;

        // Verify the token
        jwt.verify(token, process.env.JWT_KEY, async (err) => {
            if (err) return res.status(400).json({ status: "error", message: "Invalid or expired token" });

            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Update the user's password in the database
            const updatedUser = await UserModel.findByIdAndUpdate(id, { password: hashedPassword });

            if (!updatedUser) return res.status(404).json({ status: "error", message: "User not found" });

            // Respond with a success message
            return res.json({ status: "success", message: "Password reset successfully" });
        });
    } catch (error) {
        console.error("Error in forgotPass:", error);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
}