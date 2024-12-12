window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const user = JSON.parse(atob(token.split('.')[1]));
        const userEmailElement = document.getElementById("userEmail");
        if (userEmailElement) {
            userEmailElement.innerText = `Logged in as: ${user.email}`;
        }
    } catch (err) {
        console.error("Invalid token:", err);
        window.location.href = '/login.html';
        return;
    }

    fetchFlights();

    // Add event listeners for the filters
    document.querySelectorAll('input[name="airlineFilter"]').forEach(input =>
        input.addEventListener("change", applyFilters)
    );

    document.querySelectorAll('input[name="stopsFilter"]').forEach(input =>
        input.addEventListener("change", applyFilters)
    );

    document.querySelectorAll('input[name="classFilter"]').forEach(input =>
        input.addEventListener("change", applyFilters)
    );

    document.getElementById("sortOptions").addEventListener("change", applyFilters);
    document.getElementById("sortDestination").addEventListener("input", applyFilters);
    document.getElementById("sortDate").addEventListener("change", applyFilters);
});

// Show loading spinner
function showLoadingSpinner() {
    const flightsList = document.getElementById("flightsList");
    flightsList.innerHTML = `<div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                             </div>`;
}

// Fetch and display flights
function fetchFlights() {
    showLoadingSpinner();
    fetch('/data/flights.json')
        .then(response => response.json())
        .then(displayFlights)
        .catch(err => {
            console.error("Error loading flights:", err);
            document.getElementById("flightsList").innerHTML = "<p>Error loading flights. Please try again later.</p>";
        });
}

// Display flights
function displayFlights(flights) {
    const flightsList = document.getElementById("flightsList");
    flightsList.innerHTML = ` <h2>Available Flights</h2>`;
    if(flights.length > 0){
        flights.forEach(flight => {
        const flightElement = document.createElement("div");
        flightElement.className = "col-md-4 flight-card";
        flightElement.innerHTML = `
            <div class="card">
                <img src="/assets/images/${flight.image}" class="card-img-top" alt="${flight.name}">
                <div class="card-body">
                    <h5 class="card-title">${flight.name}</h5>
                    <p class="card-text">Airline: ${flight.airline}</p>
                    <p class="card-text">Destination: ${flight.destination}</p>
                    <p class="card-text">Stops: ${flight.stops}</p>
                    <p class="card-text">Class: ${flight.class}</p>
                    <p class="card-text price">$${flight.price}</p>
                    <button onclick="selectFlight(${flight.id})" class="btn btn-primary">Book Now</button>
                </div>
            </div>
        `;
        flightsList.appendChild(flightElement);
    });
    }
    else{
        flightsList.innerHTML = `
        <h1> Sorry! Not Found </h1>
        <div class="img-not-found">
                <img src="/assets/images/notfound.jpg" class="not-found">
            </div>`;
    }
}

// Apply filters and sorting
function applyFilters() {
    const airline = document.querySelector('input[name="airlineFilter"]:checked')?.value;
    const stops = document.querySelector('input[name="stopsFilter"]:checked')?.value;
    const flightClass = document.querySelector('input[name="classFilter"]:checked')?.value;
    const sortOption = document.getElementById("sortOptions").value;
    const destination = document.getElementById("sortDestination").value.trim().toLowerCase();
    const date = document.getElementById("sortDate").value;

    showLoadingSpinner();

    fetch('/data/flights.json')
        .then(response => response.json())
        .then(flights => {
            let filteredFlights = flights;

            // Apply airline filter
            if (airline) {
                filteredFlights = filteredFlights.filter(flight => flight.airline === airline);
            }

            // Apply stops filter
            if (stops) {
                filteredFlights = filteredFlights.filter(flight => flight.stops === stops);
            }

            // Apply class filter
            if (flightClass) {
                filteredFlights = filteredFlights.filter(flight => flight.class === flightClass);
            }

            // Apply destination filter
            if (destination) {
                filteredFlights = filteredFlights.filter(flight => flight.destination.toLowerCase().includes(destination));
            }

            // Apply date filter
            if (date) {
                filteredFlights = filteredFlights.filter(flight => flight.departure === date);
            }

            // Apply sorting
            if (sortOption) {
                filteredFlights = sortFlights(filteredFlights, sortOption);
            }
            

            displayFlights(filteredFlights);
        })
        .catch(err => {
            console.error("Error applying filters and sorting:", err);
            document.getElementById("flightsList").innerHTML = "<p>Error applying filters. Please try again later.</p>";
        });
}


// Sort flights based on selected option
function sortFlights(flights, sortOption) {
    switch (sortOption) {
        case "priceAsc":
            return flights.sort((a, b) => a.price - b.price);
        case "priceDesc":
            return flights.sort((a, b) => b.price - a.price);
        default:
            return flights;
    }
}

// Redirect to booking page
function selectFlight(flightId) {
    const url = `/booking.html?flightId=${flightId}`;
    window.location.href = url;
}
