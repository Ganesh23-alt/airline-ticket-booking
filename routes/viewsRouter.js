const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Serve index page
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "index.html"));
});

// Serve login page
router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "login.html"));
});

// Serve register page
router.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "register.html"));
});

// Serve dashboard page
router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "dashboard.html"));
});

// Serve flights booking page
router.get("/flights", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "flights.html"));
});

// Serve flight booking page based on flight ID
router.get("/book/:flightId", (req, res) => {
    const flightId = req.params.flightId;
    const flightsFilePath = path.join(__dirname, "../data", "flights.json");

    fs.readFile(flightsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading flights.json:", err);
            return res.status(500).json({ error: "Failed to load flight data" });
        }

        const flights = JSON.parse(data);
        const flight = flights.find(flight => flight.id == flightId);

        if (flight) {
            res.render("book", { flight }); // Render booking page with the flight details
        } else {
            res.status(404).send("Flight not found");
        }
    });
});

// Serve bookings page
router.get("/bookings", (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "booking.html"));
});

// Serve navbar HTML (static)
router.get("/navbar.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views", "navbar.html"));
});

// Serve flight data as JSON
router.get("/data/flights.json", (req, res) => {
    const flightsFilePath = path.join(__dirname, "../data", "flights.json");
    fs.readFile(flightsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading flights.json:", err);
            res.status(500).json({ error: "Failed to load flight data" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

//serve bookings data as JSON
router.get("/data/booking.json", (req, res) => {
    const flightsFilePath = path.join(__dirname, "../data", "booking.json");
    fs.readFile(flightsFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading flights.json:", err);
            res.status(500).json({ error: "Failed to load flight data" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

module.exports = router;
