import express from 'express';
import { registerUser, loginUser } from '../controllers/AuthController.js';

const router = express.Router();

//POST request to register user
router.post('/register', registerUser);
//POST request to login user
router.post('/login', loginUser);

export default router