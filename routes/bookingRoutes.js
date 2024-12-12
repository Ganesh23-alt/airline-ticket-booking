const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const authenticateToken = require('../middleware/auth');



const flightsFile = path.join(__dirname, "../data/flights.json");
const bookingsFile = path.join(__dirname, "../data/booking.json");

// Helper function to read and parse JSON files
const readJsonFile = (filePath) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        throw new Error("Error reading data file.");
    }
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
        throw new Error("Error writing data file.");
    }
};


router.post("/confirmBooking", authenticateToken, (req, res) => {
    const lock = {};
    const { flightId, name, email, seats, cardNumber, expiryDate, cvv, date } = req.body;

    if (!flightId || !name || !email || !seats ) {
        return res.status(400).send("All fields are required.");
    }

    const requestedSeats = parseInt(seats, 10);
    if (isNaN(requestedSeats) || requestedSeats <= 0) {
        return res.status(400).send("Invalid number of seats.");
    }

    if (lock[flightId]) {
        return res.status(503).send("Booking in progress. Please try again later.");
    }

    lock[flightId] = true;

    try {
        const flights = readJsonFile(flightsFile);
        const flight = flights.find((f) => f.id == flightId);

        if (!flight) {
            throw new Error("Flight not found.");
        }

        const availableSeats = parseInt(flight.availableSeats, 10);
        if (availableSeats < requestedSeats) {
            throw new Error("Insufficient seats available.");
        }

        // Update available seats
        flight.availableSeats = availableSeats - requestedSeats;
        writeJsonFile(flightsFile, flights);

        // Add new booking with a unique ID
        const bookings = readJsonFile(bookingsFile);
        const newBooking = {
            id: Date.now().toString(), // Unique ID
            flightId,
            name,
            email,
            seats: requestedSeats,
            date,
        };
        bookings.push(newBooking);
        writeJsonFile(bookingsFile, bookings);

        // Respond with success
        res.status(200).send({
            message: "Booking confirmed.",
            booking: newBooking,
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    } finally {
        delete lock[flightId];
    }
});


//delete booking 
router.post("/checkout", authenticateToken, (req, res) => {
    const { bookingId } = req.body;  // Get the booking ID from the request body

    if (!bookingId) {
        return res.status(400).send("Booking ID is required.");
    }

    try {
        // Read the current bookings and flights data
        const bookings = readJsonFile(bookingsFile);
        const flights = readJsonFile(flightsFile);

        // Find the booking by ID
        const bookingIndex = bookings.findIndex((b) => b.id === bookingId);
        if (bookingIndex === -1) {
            throw new Error("Booking not found.");
        }

        // Get the flight associated with this booking
        const booking = bookings[bookingIndex];
        const flight = flights.find((f) => f.id == booking.flightId);

        if (!flight) {
            throw new Error("Flight not found.");
        }

        // Update available seats for the flight
        const availableSeats = parseInt(flight.availableSeats, 10);
        flight.availableSeats = availableSeats + booking.seats;  // Add back the seats that were booked

        // Remove the booking from the bookings array
        bookings.splice(bookingIndex, 1);

        // Write the updated bookings and flights data back to the files
        writeJsonFile(bookingsFile, bookings);
        writeJsonFile(flightsFile, flights);

        // Respond with success
        res.status(200).send({
            message: "Checkout successful. Booking has been removed.",
            updatedFlight: flight,
        });
    } catch (err) {
        console.error(err.message);
        res.status(400).send(err.message);
    }
});



module.exports = router;
