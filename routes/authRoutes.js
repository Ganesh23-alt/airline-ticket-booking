const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// File path for storing user data
const usersFilePath = path.join(__dirname, "../data/users.json");

// User Registration
router.post("/register", (req, res) => {
    const { name, email, password, phone, countryCode } = req.body;

    fs.readFile(usersFilePath, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ message: "Error reading user data." });

        let users = JSON.parse(data);
        if (users.some(user => user.email === email)) {
            return res.status(400).json({ message: "User already exists." });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: "Error hashing password." });

            const newUser = {
                name,
                email,
                password: hashedPassword,
                phone,
                countryCode,
            };

            users.push(newUser);

            fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                if (err) return res.status(500).json({ message: "Error saving user." });
                res.status(201).json({ message: "User registered successfully." });
            });
        });
    });
});
// User Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    fs.readFile(usersFilePath, "utf-8", (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading user data." });
        }

        let users = JSON.parse(data);
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: "Error comparing passwords." });
            }

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password." });
            }

            // Create JWT token
            const token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.status(200).json({
                message: "Login successful",
                token: token,
                email:user.email
            });
        });
    });
});

module.exports = router;
