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

//confirm booking route 
// router.post("/confirmBooking", (req, res) => {
//     const lock = {};
//     const { flightId, name, email, seats, cardNumber, expiryDate, cvv, date } = req.body;

//     if (!flightId || !name || !email || !seats || !cardNumber || !expiryDate || !cvv || !date) {
//         return res.status(400).send("All fields are required.");
//     }

//     const requestedSeats = parseInt(seats, 10);
//     if (isNaN(requestedSeats) || requestedSeats <= 0) {
//         return res.status(400).send("Invalid number of seats.");
//     }

//     if (lock[flightId]) {
//         return res.status(503).send("Booking in progress. Please try again later.");
//     }

//     lock[flightId] = true;

//     try {
//         const flights = readJsonFile(flightsFile);
//         const flight = flights.find((f) => f.id == flightId);

//         if (!flight) {
//             throw new Error("Flight not found.");
//         }

//         const availableSeats = parseInt(flight.availableSeats, 10);
//         if (availableSeats < requestedSeats) {
//             throw new Error("Insufficient seats available.");
//         }

//         // Update available seats
//         flight.availableSeats = availableSeats - requestedSeats;
//         writeJsonFile(flightsFile, flights);

//         // Add new booking with a unique ID
//         const bookings = readJsonFile(bookingsFile);
//         const newBooking = {
//             id: Date.now().toString(), // Unique ID
//             flightId,
//             name,
//             email,
//             seats: requestedSeats,
//             date,
//         };
//         bookings.push(newBooking);
//         writeJsonFile(bookingsFile, bookings);

//         // Respond with success
//         res.status(200).send({
//             message: "Booking confirmed.",
//             booking: newBooking,
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(400).send(err.message);
//     } finally {
//         delete lock[flightId];
//     }
// });

router.post("/confirmBooking", authenticateToken, (req, res) => {
    const lock = {};
    const { flightId, name, email, seats, cardNumber, expiryDate, cvv, date } = req.body;

    if (!flightId || !name || !email || !seats || !cardNumber || !expiryDate || !cvv || !date) {
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


module.exports = router;
