import express from 'express';
import { addReply, createComment, deleteComment, deleteReply, editReply, getAllComments, getAllReplies, getComment, updateComment } from '../controllers/CommentController.js';

const router = express.Router();

//POST request to create a new comment
router.post('/', createComment)
//GET request to get all comments
router.get('/comments', getAllComments)
//GET request to get a specific comment 
router.get('/:id', getComment)
//PUT request to update a specific comment
router.put('/:id', updateComment)
//DELETE request to delete a specific comment
router.delete('/:id', deleteComment)
//PUT request to add a reply on a comment
router.put('/:id/reply', addReply)
//GET request to get all replies for a comment
router.get('/:id/replies', getAllReplies)
//PUT request to edit a reply on a comment
router.put('/:id/:replyId', editReply)
//DELETE request to delete a reply on a comment
router.delete('/:id/:replyId', deleteReply)

export default router