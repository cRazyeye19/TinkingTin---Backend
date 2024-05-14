import express from 'express';
import authMiddleWare from '../middleware/AuthWare.js';
import { getMessages, sendMessage } from '../controllers/MessageController.js';

const router = express.Router();

router.post('/', authMiddleWare, sendMessage);
router.get('/:chatId', authMiddleWare, getMessages);

export default router