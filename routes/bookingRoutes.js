const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const flightsFile = path.join(__dirname, "../data/flights.json");
const bookingsFile = path.join(__dirname, "../data/booking.json");

// router.get("/", (req, res) => {
//     fs.readFile(bookingsFile, "utf-8", (err, data) => {
//         if (err) return res.status(500).json({ message: "Error fetching flights." });
//         res.json(JSON.parse(data));
//     });
// });

router.post("/confirmBooking", (req, res) => {
    const { flightId,
            name,
            email,
            seats,
            cardNumber,
            expiryDate,
            cvv,
            date } = req.body;
    const flights = JSON.parse(fs.readFileSync(flightsFile));
    const flight = flights.find(f => f.id == flightId);

    if (!flight || flight.availableSeats < seats) {
        return res.status(400).send("Insufficient seats available.");
    }

    flight.availableSeats -= seats;
    fs.writeFileSync(flightsFile, JSON.stringify(flights, null, 2));

    const bookings = JSON.parse(fs.readFileSync(bookingsFile));
    const newBooking = { flightId,
            name,
            email,
            seats,
            cardNumber,
            expiryDate,
            cvv,
            date };
    bookings.push(newBooking);
    fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));

    res.status(200).send(newBooking);
});

module.exports = router;
