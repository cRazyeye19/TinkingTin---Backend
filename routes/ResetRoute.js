import express from 'express';
import { forgotPass } from '../controllers/AuthController.js';

const router = express.Router();

//POST request to reset password
router.post('/:id/:token', forgotPass)

export default router