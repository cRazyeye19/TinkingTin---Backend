import express from 'express';
import { resetPass } from '../controllers/AuthController.js';

const router = express.Router();

//POST request to forgot password
router.post('/', resetPass);

export default router