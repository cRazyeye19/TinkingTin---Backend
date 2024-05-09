import express from 'express';
import { createTicket, deleteTicket, getAllTickets, getTickets, updateTicket } from '../controllers/TicketController.js';

const router = express.Router();

//GET request to get all tickets
router.get('/tickets', getAllTickets)
//POST request to create a ticket
router.post('/', createTicket)
//GET request to get specific ticket
router.get('/:id', getTickets)
//PUT request to update a ticket
router.put('/:id', updateTicket)
//DELETE request to delete a ticket
router.delete('/:id', deleteTicket)

export default router