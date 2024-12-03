document.addEventListener('DOMContentLoaded', function() {
    // Login function 
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email); // Store email in local storage
                window.location.href = '/'; 
            } else {
                // alert('Login failed: ' + data.message);
            }
        });
    }
//google login function 
document.getElementById('googleSignInBtn').onclick = function() {
    google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleCredentialResponse
    });
    google.accounts.id.prompt();
};

async function handleCredentialResponse(response) {
    const token = response.credential;

    const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    });

    const data = await res.json();
    if (data.success) {
        localStorage.setItem('token', data.token); // Save token in localStorage
        window.location.href = '/'; // Redirect to homepage or dashboard
    } else {
        // alert('Google login failed: ' + data.message);
    }
}


// registration function 
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const countryCode = document.getElementById("countryCode").value;
        const phone = document.getElementById("phone").value;
        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:3004/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, countryCode, phone, password }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Registration successful! Please log in.");
            window.location.href = "/login"; // Redirect to login page
        } else {
            alert("Registration failed: " + data.message);
        }
    });
}


// Flight search function

document.getElementById('tripType').addEventListener('change', function() {
    const tripType = this.value;
    const returnDateContainer = document.getElementById('returnDateContainer');
    
    if (tripType === 'roundTrip') {
        returnDateContainer.style.display = 'block'; // Show return date field
    } else {
        returnDateContainer.style.display = 'none'; // Hide return date field
    }
});

const flightSearchForm = document.getElementById('flightSearchForm');
if (flightSearchForm) {
    flightSearchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const tripType = document.getElementById('tripType').value;
        const departureDate = document.getElementById('departureDate').value;
        const returnDate = document.getElementById('returnDate').value;
        const travelers = document.getElementById('travelers').value;
        const cabinClass = document.getElementById('cabinClass').value;
        const destination = document.getElementById('destination').value;

        const searchCriteria = {
            tripType,
            departureDate,
            returnDate,
            travelers: parseInt(travelers),
            cabinClass,
            destination
        };

        const response = await fetch('/api/flights/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchCriteria)
        });

        const data = await response.json();
        if (data.flights && data.flights.length > 0) {
            displayFlights(data.flights);
        } else {
            alert('No flights found for the given criteria.');
        }
    });
}

    // Function to toggle the return date field based on trip type
        function toggleReturnDate() {
            const tripType = document.getElementById('tripType').value;
            const returnDateContainer = document.getElementById('returnDateContainer');

            // Show return date input for round trip and multi-city, hide for one-way
            if (tripType === 'roundTrip' || tripType === 'multiCity') {
                returnDateContainer.style.display = 'block';
            } else {
                returnDateContainer.style.display = 'none';
            }
        }


    // Fetch and display user bookings
    const bookingsList = document.getElementById('bookingsList');
    const userEmail = localStorage.getItem('userEmail');

    if (bookingsList && userEmail) {
        fetchUserBookings(userEmail);
    }
});

// Function to display flights
function displayFlights(flights) {
    const flightList = document.getElementById('flightResults');
    if (!flightList) {
        console.error("Element with ID 'flightResults' not found.");
        return;
    }
    
    flightList.innerHTML = ''; 

    flights.forEach(flight => {
        const flightItem = document.createElement('div');
        flightItem.className = 'flight-item';
        flightItem.innerHTML = `
            <h4>${flight.name}</h4>
            <p>Destination: ${flight.destination}</p>
            <p>Departure: ${new Date(flight.departure).toLocaleString()}</p>
            <p>Price: $${flight.price}</p>
            <p>Available Seats: <span id="availableSeats_${flight.id}">${flight.availableSeats}</span></p>
            <button class="btn btn-success" onclick="bookFlight('${flight.id}')">Book Now</button>
        `;
        flightList.appendChild(flightItem);
    });
}

// Handle flight booking 
async function bookFlight(flightId) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        alert("You need to log in to book a flight.");
        return;
    }

    const seats = prompt("Enter number of seats to book:");

    if (!seats || isNaN(seats) || seats <= 0) {
        alert("Please enter a valid number of seats.");
        return;
    }

    const bookingData = {
        flightId,
        userEmail,
        seats: parseInt(seats, 10)
    };

    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
        alert(data.message); // Show success message
        const availableSeatsElement = document.getElementById(`availableSeats_${flightId}`);
        const currentAvailableSeats = parseInt(availableSeatsElement.innerText, 10);
        availableSeatsElement.innerText = currentAvailableSeats - bookingData.seats;
        window.location.href = 'bookings'; // Redirect to bookings page
    } else {
        alert(`Booking failed: ${data.message || 'Unknown error'}`); // Show error message
    }
}

// Fetch user bookings function
async function fetchUserBookings(userEmail) {
    try {
        const response = await fetch(`/api/bookings/${userEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            displayUserBookings(data);
        } else {
            bookingsList.innerHTML = '<p>No bookings found.</p>'; 
        }
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        bookingsList.innerHTML = '<p>Error loading bookings. Please try again later.</p>';
    }
}

// Display user bookings function
function displayUserBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = ''; 

    bookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.className = 'list-group-item list-group-item-action';
        bookingItem.innerHTML = `
            <h5>Flight ID: ${booking.flightId}</h5>
            <p>User Email: ${booking.userEmail}</p>
            <p>Seats Booked: ${booking.seats}</p>
            <p>Date of Booking: ${new Date(booking.date).toLocaleString()}</p>
        `;
        bookingsList.appendChild(bookingItem);
    });
}

// Other functionalities 
// Loading navbar
document.addEventListener("DOMContentLoaded", function() {
    fetch("/navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            updateNavbar();
        })
        .catch(error => {
            console.error("Error loading navbar:", error);
        });
});

// Function to update navbar based on login status
function updateNavbar() {
    const userEmail = localStorage.getItem('userEmail');
    const navbarItems = document.getElementById('navLinks');

    navbarItems.innerHTML = ''; 

    if (userEmail) {
        const userName = userEmail.split('@')[0];

        navbarItems.innerHTML += `
            <li class="nav-item dropdown" id="userNavItem">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Hello, ${userName}
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a class="dropdown-item" href="/bookings">Your Bookings</a>
                    <a class="dropdown-item" href="#" id="logoutButton">Logout</a>
                </div>
            </li>
            <li class="nav-item" id="bookFlightNavItem">
                <a class="btn btn-primary" id="bookFlightButton" href="/flights">Book Flight</a>
            </li>
            <li> <button id="userProfileToggle">User Profile</button> </li>

        `;
        //         // <span id="userEmail"></span>

        // Add logout functionality
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('token'); 
                localStorage.removeItem('userEmail'); 
                window.location.href = '/login';
            });
        }

        // Initialize Bootstrap dropdown
        $('.dropdown-toggle').dropdown(); // Make sure jQuery is available
    } else {
        // User is not logged in
        navbarItems.innerHTML += `
            <li class="nav-item" id="loginNavItem">
                <a class="nav-link" href="/login">Login</a>
            </li>
            <li class="nav-item" id="registerNavItem">
                <a class="nav-link" href="/register">Register</a>
            </li>
        `;
    }
}
// Fetch flights data from server
fetch('/api/flights/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const flightList = document.getElementById('flight-list');
        flightList.innerHTML = ''; // Clear any existing content

        data.forEach(flight => {
            const flightCard = `
                <div class="col-md-4">
                    <div class="card mb-4">
                        <img src="/assets/images/${flight.image}" class="card-img-top" alt="${flight.name}">
                        <div class="card-body">
                            <h5 class="card-title">${flight.name}</h5>
                            <p class="card-text">Destination: ${flight.destination}</p>
                            <p class="card-text">Departure: ${new Date(flight.departure).toLocaleString()}</p>
                            <p class="card-text">Arrival: ${new Date(flight.arrival).toLocaleString()}</p>
                            <p class="card-text">Price: $${flight.price}</p>
                            <p class="card-text">Available Seats: ${flight.availableSeats}</p>
                            <a href="/book?flight=${flight.id}" class="btn btn-primary" ${flight.availableSeats === 0 ? 'disabled' : ''}>
                                ${flight.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                            </a>
                        </div>
                    </div>
                </div>
            `;
            flightList.innerHTML += flightCard;
        });
    })
    .catch(error => console.error('Error fetching flights:', error));










