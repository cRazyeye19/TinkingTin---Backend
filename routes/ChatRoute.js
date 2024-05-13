import express from 'express';
import authMiddleWare from '../middleware/AuthWare.js';
import { accessChat, createGroupChat, fetchChats } from '../controllers/ChatController.js';

const router = express.Router();

router.post('/', authMiddleWare, accessChat);
router.get('/', authMiddleWare, fetchChats);
router.post('/group', authMiddleWare, createGroupChat);
// router.put('/group/rename', authMiddleWare, renameGroup);
// router.put('/group/remove', authMiddleWare, removeFromGroup);
// router.put('/group/add', authMiddleWare, addToGroup);

export default router