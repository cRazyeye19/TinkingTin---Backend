import express from 'express';
import { registerUser, loginUser, searchUsers } from '../controllers/AuthController.js';
import authMiddleWare from '../middleware/AuthWare.js';

const router = express.Router();

//POST request to register user
router.post('/register', registerUser)
//POST request to login user
router.post('/login', loginUser);
//GET request to get all users via searching
router.get('/', authMiddleWare, searchUsers)

export default router