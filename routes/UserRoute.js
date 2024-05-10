import express from 'express';
import authMiddleWare from '../middleware/AuthWare.js';
import { deleteUser, getAllUsers, getUser, updateAssignee, updateUser } from '../controllers/UserController.js';

const router = express.Router();

/*
This router configuration sets up the endpoints for the user-related HTTP requests.
Each line below sets up a different route with a specific HTTP method and path.

The configuration:
- `router.get('/:id', getUser)` - This line sets up a GET request to a specific user resource identified by the 'id' parameter in the URL. The 'getUser' function from the UserController is called to handle this request.

- `router.get('/', getAllUsers)` - This line sets up a GET request to the root URL '/'. The 'getAllUsers' function from the UserController is called to handle this request and it's expected to return all the user resources.

- `router.put('/:id', updateUser)` - This line sets up a PUT request to a specific user resource identified by the 'id' parameter in the URL. The 'updateUser' function from the UserController is called to handle this request and it's expected to update the user resource identified by 'id'.

- `router.delete('/:id', deleteUser)` - This line sets up a DELETE request to a specific user resource identified by the 'id' parameter in the URL. The 'deleteUser' function from the UserController is called to handle this request and it's expected to delete the user resource identified by 'id'.
*/
router.get('/users', getAllUsers)
router.get('/:id', getUser)
router.put('/:id', authMiddleWare, updateUser)
router.put('/assign/:id', authMiddleWare, updateAssignee)
router.delete('/:id', authMiddleWare, deleteUser)

export default router