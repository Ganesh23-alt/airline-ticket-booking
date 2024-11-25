// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const path = require("path");


// const flightsFilePath = path.join(__dirname, "../data/flights.json");
// let flights = require(flightsFilePath);

// // Flight search route 
// router.post("/search", (req, res) => {
//     const { tripType, destination, departureDate, returnDate, travelers, cabinClass } = req.body;

//     // Filter flights by destination and dates
//     let results = flights.filter(flight => {
//         const isMatchingDestination = flight.destination.toLowerCase() === destination.toLowerCase();
//         const isMatchingDate = flight.date === departureDate;
//         const isMatchingCabinClass = flight.cabinClass.toLowerCase() === cabinClass.toLowerCase();
        
//         return isMatchingDestination && isMatchingDate && isMatchingCabinClass;
//     });

//     // Further filter for available seats and trip type
//     if (tripType === 'roundTrip') {
//         results = results.filter(flight => flight.returnDate === returnDate); // Handle return date
//     }

//     results = results.filter(flight => flight.availableSeats >= travelers); // Check for enough available seats

//     res.json({ flights: results });
// });


// module.exports = router;


const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Path to the flights data
const flightsFilePath = path.join(__dirname, "../data/flights.json");

// Get all flights
router.get("/", (req, res) => {
    fs.readFile(flightsFilePath, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching flights." });
        res.json(JSON.parse(data));
    });
});

// Get flight by id
router.get("/:id", (req, res) => {
    const { id } = req.params;
    fs.readFile(flightsFilePath, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error fetching flight." });
        const flights = JSON.parse(data);
        const flight = flights.find(f => f.id === id);
        if (!flight) return res.status(404).json({ message: "Flight not found." });
        res.json(flight);
    });
});

module.exports = router;
