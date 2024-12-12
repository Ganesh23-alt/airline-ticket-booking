


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
