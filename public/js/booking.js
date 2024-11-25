window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        redirectToLogin();
        return;
    }

    try {
        const user = decodeToken(token);
        displayUserEmail(user.email);
    } catch (err) {
        console.error("Invalid token:", err);
        redirectToLogin();
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('flightId');

    if (flightId) {
        fetchFlightDetails(flightId);
    } else {
        console.error("Flight ID is missing from the URL.");
        handleErrorRedirect("Invalid flight ID.");
    }

    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleBookingFormSubmit(token); // Pass token for authentication
        });
    } else {
        console.error("Booking form not found on the page.");
    }
});

// Decode JWT token
function decodeToken(token) {
    try {
        const payload = token.split('.')[1]; // Get the payload part of the token
        return JSON.parse(atob(payload)); // Decode and parse the payload
    } catch (error) {
        throw new Error("Failed to decode token.");
    }
}

// Redirect to login page
function redirectToLogin() {
    alert("You must be logged in to book a flight.");
    window.location.href = '/login.html';
}

// Display the logged-in user's email
function displayUserEmail(email) {
    const userEmailElement = document.getElementById("userEmail");
    if (userEmailElement) {
        userEmailElement.innerText = `Logged in as: ${email}`;
    }
}

// Fetch flight details from the server
function fetchFlightDetails(flightId) {
    fetch('/data/flights.json')
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch flight details.");
            return response.json();
        })
        .then((flights) => {
            console.log("All flights data:", flights); // Debugging log
            const flight = flights.find((f) => f.id.toString() === flightId.toString()); // Ensure type match
            console.log("Flight found:", flight); // Debugging log
            if (flight) {
                displayFlightDetails(flight);
            } else {
                handleErrorRedirect("Flight not found.");
            }
        })
        .catch((err) => {
            console.error("Error loading flight details:", err);
            handleErrorRedirect("Error loading flight details.");
        });
}

// Display flight details on the booking page
function displayFlightDetails(flight) {
    const flightDetails = document.getElementById("flightDetails");
    if (!flightDetails) {
        console.error("Flight details element not found.");
        return;
    }
    flightDetails.innerHTML = `
        <div class="col-md-12">
            <div class="card">
                <img src="/assets/images/${flight.image}" class="card-img-top" alt="${flight.name}">
                <div class="card-body">
                    <h5 class="card-title">${flight.name}</h5>
                    <p><strong>Airline:</strong> ${flight.airline}</p>
                    <p><strong>Destination:</strong> ${flight.destination}</p>
                    <p><strong>Departure:</strong> ${new Date(flight.departureDate).toLocaleString()}</p>
                    <p><strong>Arrival:</strong> ${new Date(flight.arrivalDate).toLocaleString()}</p>
                    <p><strong>Price:</strong> $${flight.price}</p>
                    <p><strong>Class:</strong> ${flight.class}</p>
                    <p><strong>No of Stops:</strong> ${flight.stops}</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById("flightId").value = flight.id; // Populate hidden input for flight ID
}

// Handle error redirect
function handleErrorRedirect(message) {
    console.error(message);
    alert(message);
    window.location.href = '/flights.html';
}

// Handle booking form submission
function handleBookingFormSubmit(token) {
    const flightId = document.getElementById("flightId")?.value;
    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const seats = document.getElementById("seats")?.value.trim();
    const cardNumber = document.getElementById("cardNumber")?.value.trim();
    const expiryDate = document.getElementById("expiryDate")?.value.trim();
    const cvv = document.getElementById("cvv")?.value.trim();

    // Validate required fields
    if (![flightId, name, email, seats, cardNumber, expiryDate, cvv].every(Boolean)) {
        alert("Please fill in all required fields.");
        return;
    }

    const booking = {
        flightId,
        name,
        email,
        seats,
        cardNumber,
        expiryDate,
        cvv,
        date: new Date().toISOString(),
    };

    submitBooking(booking, token);
}

// Submit booking to the server
// function submitBooking(booking, token) {
//     fetch('/api/confirmBooking', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`, // Include token for authentication
//         },
//         body: JSON.stringify(booking),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 return response.json().then((error) => {
//                     throw new Error(error.message || "Booking failed.");
//                 });
//             }
//             return response.json();
//         })
//         .then((data) => {
//             alert(data.message);
//             window.location.href = `/receipt.html?bookingId=${data.booking.id}`; // Redirect with booking ID
//         })
//         .catch((err) => {
//             console.error("Error:", err);
//             alert("Booking failed. Please try again.");
//         });
// }

function submitBooking(booking) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
        alert("You must be logged in to book a flight.");
        redirectToLogin();
        return;
    }

    fetch('/api/confirmBooking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add token for authentication
        },
        body: JSON.stringify(booking),
    })
        .then(async (response) => {
            if (!response.ok) {
                // Try to extract error details if the response is not JSON
                const errorText = await response.text();
                throw new Error(errorText || "Booking failed.");
            }
            return response.json();
        })
        .then((data) => {
            alert(data.message);
            window.location.href = `/receipt.html?bookingId=${data.booking.id}`; // Redirect with booking ID
        })
        .catch((err) => {
            console.error("Error:", err);

            if (err.message.includes("Invalid or expired token")) {
                alert("Your session has expired. Please log in again.");
                redirectToLogin(); // Redirect to login on token failure
            } else {
                alert(`Booking failed: ${err.message}`);
            }
        });
}

// Redirect to login page
function redirectToLogin() {
    alert("You must be logged in to book a flight")
    window.location.href = '/login.html';
}

