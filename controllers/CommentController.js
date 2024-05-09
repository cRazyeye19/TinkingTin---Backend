import CommentModel from "../models/commentModel.js";

/**
 * Create a new comment
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The created comment
 */
export const createComment = async (req, res) => {

    // Create a new comment using the request body
    const newComment = new CommentModel(req.body);

    try {

        // Save the new comment to the database
        await newComment.save();
        // Return the created comment as a JSON response
        res.status(200).json(newComment);

    } catch (error) {

        // If there's an error, return it as a JSON response
        res.status(500).json({ message: error.message });
    }
}

/**
 * Get a comment by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The comment
 */
export const getComment = async (req, res) => {
    // Get the comment ID from the request parameters
    const id = req.params.id;

    try {
        // Find the comment by its ID and return it as a JSON response
        const comment = await CommentModel.findById(id);
        res.status(200).json(comment);
    } catch (error) {
        // If there's an error, return it as a JSON response
        res.status(500).json(error);
    }
}

/**
 * Get all comments
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Array} An array of comments
 */
export const getAllComments = async (req, res) => {
    try {
        // Find all comments and return them as a JSON response
        const comments = await CommentModel.find();
        res.status(200).json(comments);
    } catch (error) {
        // If there's an error, return it as a JSON response
        res.status(500).json(error);
    }
}

/**
 * Update a comment by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The updated comment
 */
export const updateComment = async (req, res) => {
    // Get the comment ID from the request parameters
    const id = req.params.id;

    try {
        // Find the comment by its ID
        const comment = await CommentModel.findById(id);
        // If the comment doesn't exist, return a 404 error
        if (!comment) {
            res.status(404).json("Comment not found");
        }
        // Update the comment with the request body and return it as a JSON response
        const updatedComment = await CommentModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedComment);
    } catch (error) {
        // If there's an error, return it as a JSON response
        res.status(500).json(error);
    }
}

/**
 * Delete a comment by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The deleted comment
 */
export const deleteComment = async (req, res) => {
    // Get the comment ID from the request parameters
    const id = req.params.id;

    try {
        // Find the comment by its ID
        const comment = await CommentModel.findById(id);
        // If the comment doesn't exist, return a 404 error
        if (!comment) {
            res.status(404).json("Comment not found");
        }
        // Delete the comment and return it as a JSON response
        const deletedComment = await CommentModel.findByIdAndDelete(id);
        res.status(200).json(deletedComment);
    } catch (error) {
        // If there's an error, return it as a JSON response
        res.status(500).json(error);
    }
}

/**
 * Add a reply to a comment by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} The updated comment with the new reply
 */
export const addReply = async (req, res) => {

    // Get the comment ID from the request parameters
    const id = req.params.id;

    try {
        // If the comment ID exists
        if (id) {
            // Create a new reply object with the username, comment ID, and reply text
            const reply = {
                username: req.body.username,
                commentId: id,
                reply: req.body.reply
            }
            // Find the comment by its ID, update it with the new reply, and return it as a JSON response
            const newComment = await CommentModel.findByIdAndUpdate({ _id: id }, { $push: { replies: reply } }, { new: true });
            res.status(200).json(newComment);
        }
    } catch (error) {
        // If there's an error, return it as a JSON response
        res.status(500).json({ message: error.message });
    }
}