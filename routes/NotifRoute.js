import express from 'express';
import authMiddleWare from '../middleware/AuthWare.js';
import { createNotif, deleteNotif, getNotifs } from '../controllers/NotificationController.js';

const router = express.Router(); // creates a new router object which is an instance of express.Router

router.post('/', // post request to create a new notification
  authMiddleWare, // requires a logged in user
  createNotif // calls the createNotif controller function to create a new notification
);

router.get('/notifs', // get request to retrieve all notifications for a user
  authMiddleWare, // requires a logged in user
  getNotifs // calls the getNotifs controller function to retrieve all notifications for a user
);

router.delete('/:id', // delete request to delete a notification by its id
  authMiddleWare, // requires a logged in user
  deleteNotif // calls the deleteNotif controller function to delete a notification by its id
);

export default router;