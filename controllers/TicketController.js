import TicketModel from "../models/ticketModel.js";

// This function handles the creation of a new ticket
export const createTicket = async (req, res) => {
    // Create a new ticket object using the data from the request body
    const newTicket = new TicketModel(req.body);

    try {
        // Save the new ticket to the database
        await newTicket.save();
        // Respond with a JSON object containing the newly created ticket
        res.status(200).json(newTicket);

    } catch (error) {
        // If there was an error saving the ticket, respond with a 500 status code
        // and include an error message in the response
        res.status(500).json({ message: error.message });
    }
}

// This function handles the retrieval of a specific ticket
export const getTickets = async (req, res) => {
    // Extract the ID of the ticket from the request parameters
    const id = req.params.id;

    try {
        // Find and retrieve the ticket with the specified ID from the database
        const ticket = await TicketModel.findById(id);
        // Respond with a JSON object containing the retrieved ticket
        res.status(200).json(ticket);

    } catch (error) {
        // If there was an error retrieving the ticket, respond with a 500 status code
        // and include an error message in the response
        res.status(500).json({ message: error.message });
    }
}

// This function handles the retrieval of all tickets
export const getAllTickets = async (req, res) => {
    try {
        // Find and retrieve all tickets from the database
        const tickets = await TicketModel.find();
        // Respond with a JSON object containing an array of all the retrieved tickets
        res.status(200).json(tickets);
    } catch (error) {
        // If there was an error retrieving the tickets, respond with a 500 status code
        // and include an error message in the response
        res.status(500).json({ message: error.message });
    }
}

// This function handles the update of a specific ticket
export const updateTicket = async (req, res) => {
    // Extract the ID of the ticket from the request parameters
    const ticketId = req.params.id;

    try {
        // Find and retrieve the ticket with the specified ID from the database
        const ticket = await TicketModel.findById(ticketId);
        // If the ticket was not found, respond with a 404 status code and an error message
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

        // Update the ticket with the data from the request body and save the changes to the database
        const updatedTicket = await TicketModel.findByIdAndUpdate(ticketId, req.body, { new: true });
        // Respond with a JSON object containing the updated ticket
        res.status(200).json(updatedTicket);

    } catch (error) {
        // If there was an error updating the ticket, respond with a 500 status code
        // and include an error message in the response
        res.status(500).json({ message: error.message });
    }
};

// This function handles the deletion of a specific ticket
export const deleteTicket = async (req, res) => {
    // Extract the ID of the ticket from the request parameters
    const ticketId = req.params.id;

    try {
        // Find and retrieve the ticket with the specified ID from the database
        const ticket = await TicketModel.findById(ticketId);
        // If the ticket was not found, respond with a 404 status code and an error message
        if (!ticket) return res.status(404).json({ message: "Ticket already deleted" });

        // Delete the ticket from the database and respond with a success message
        await TicketModel.findByIdAndDelete(ticketId);
        res.status(200).json({ message: "Ticket Deleted" });

    } catch (error) {
        // If there was an error deleting the ticket, respond with a 500 status code
        // and include an error message in the response
        res.status(500).json({ message: error.message });
    }
}

