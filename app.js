require('dotenv').config(); // Load environment variables

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const viewsRouter = require("./routes/viewsRouter"); 
const authRoutes = require("./routes/authRoutes"); 
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use views router
app.use("/", viewsRouter);
app.use("/api", authRoutes);
app.use("/api", bookingRoutes);



// Serve static files from 'public' and 'views' folders
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/data/booking.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'booking.json'));
});




app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
