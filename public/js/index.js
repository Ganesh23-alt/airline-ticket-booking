window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }

    const user = JSON.parse(atob(token.split('.')[1]));
    
    const userEmailElement = document.getElementById("userEmail");
    if (userEmailElement) {
        userEmailElement.innerText = `Logged in as: ${user.email}`;
    }

    fetchFlights();

    // Add event listeners to the elements after DOM is ready
    const airlineFilter = document.getElementById("airlineFilter");
    const priceSort = document.getElementById("priceSort");
    const dateSort = document.getElementById("dateSort");
    const searchForm = document.getElementById("searchForm");
    const redirectSearch = document.getElementById("redirectSearch");

    if (airlineFilter) airlineFilter.addEventListener("change", applyFilters);
    if (priceSort) priceSort.addEventListener("change", applyFilters);
    if (dateSort) dateSort.addEventListener("change", applyFilters);
    if (searchForm) searchForm.addEventListener("submit", searchFlights);
    if (redirectSearch) redirectSearch.addEventListener("submit", redirectSearchPage);
});

function redirectSearchPage(event) {
    event.preventDefault();  // Prevent the form from submitting and reloading the page
    console.log("Redirecting to dashboard...");
    window.location.href = '/dashboard'; // Change to the desired URL
}

function fetchFlights() {
    fetch('/data/flights.json')
        .then(response => response.json())
        .then(displayFlights)
        .catch(err => console.error("Error loading flights:", err));
}

function displayFlights(flights) {
    const flightsList = document.getElementById("flightsList");
    flightsList.innerHTML = `
        <div id="flightCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner" id="carouselInner"></div>
            <button class="carousel-control-prev" type="button" data-bs-target="#flightCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#flightCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `;

    const carouselInner = document.getElementById("carouselInner");
    let index = 0;

    for (let i = 0; i < flights.length; i += 3) {
        const carouselItem = document.createElement("div");
        carouselItem.className = `carousel-item ${index === 0 ? "active" : ""}`;

        const flightCards = flights.slice(i, i + 3).map(flight => `
            <div class="col-sm-12 col-md-6 col-lg-4 d-flex justify-content-center">
                <div class="card flight-card">
                    <img src="/assets/images/${flight.image}" class="card-img-top" alt="${flight.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${flight.name}</h5>
                        <p class="card-text">Airline: ${flight.airline}</p>
                        <p class="card-text text-primary">Destination: ${flight.destination}</p>
                        <p class="card-text text-primary">Departure Date: ${flight.departure}</p>
                        <p class="card-text text-primary">Price: $${flight.price}</p>
                        <p class="card-text text-primary">Seats Available: ${flight.availableSeats}</p>
                        <button onclick="selectFlight(${flight.id})" class="btn btn-primary">Book Now</button>
                    </div>
                </div>
            </div>
        `).join("");

        carouselItem.innerHTML = `<div class="row justify-content-center">${flightCards}</div>`;
        carouselInner.appendChild(carouselItem);
        index++;
    }
}


function applyFilters() {
    const airline = document.getElementById("airlineFilter").value;
    const priceOrder = document.getElementById("priceSort").value;
    const dateOrder = document.getElementById("dateSort").value;

    fetch('/data/flights.json')
        .then(response => response.json())
        .then(flights => {
            let filteredFlights = flights;

            if (airline) {
                filteredFlights = filteredFlights.filter(flight => flight.airline === airline);
            }

            if (priceOrder) {
                filteredFlights = filteredFlights.sort((a, b) => {
                    return priceOrder === 'asc' ? a.price - b.price : b.price - a.price;
                });
            }

            if (dateOrder) {
                filteredFlights = filteredFlights.sort((a, b) => {
                    if (dateOrder === 'nearest') {
                        return new Date(a.departure) - new Date(b.departure);
                    } else {
                        return new Date(b.departure) - new Date(a.departure);
                    }
                });
            }

            displayFlights(filteredFlights);
        })
        .catch(err => console.error("Error applying filters:", err));
}

function searchFlights(event) {
    event.preventDefault();  // Prevent the form from submitting and reloading the page

    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const departureDate = document.getElementById("departureDate").value;
    const returnDate = document.getElementById("returnDate").value;
    
    fetch('/data/flights.json')
        .then(response => response.json())
        .then(flights => {
            let filteredFlights = flights;

            // Filtering by origin (from), destination (to), departure date, and return date
            if (from) {
                filteredFlights = filteredFlights.filter(flight => flight.origin.toLowerCase() === from.toLowerCase());
            }
            
            if (to) {
                filteredFlights = filteredFlights.filter(flight => flight.destination.toLowerCase() === to.toLowerCase());
            }

            if (departureDate) {
                filteredFlights = filteredFlights.filter(flight => flight.departure === departureDate);
            }

            if (returnDate) {
                filteredFlights = filteredFlights.filter(flight => flight.return === returnDate);
            }

            // Display the filtered flights
            displayFlights(filteredFlights);
        })
        .catch(err => console.error("Error applying search filters:", err));

    console.log(`Searching flights from ${from} to ${to} on ${departureDate} with return date: ${returnDate}`);
}

function selectFlight(flightId) {
    const url = `/booking.html?flightId=${flightId}`;
    window.location.href = url;
}

// main section 
// JavaScript for Carousel Effect
document.addEventListener('DOMContentLoaded', () => {
    // Select all circle-image divs
    const imageContainers = document.querySelectorAll('.circle-image');

    imageContainers.forEach(container => {
        const images = container.querySelectorAll('.carousel-image');
        let currentIndex = 0;

        function changeImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

        // Set interval for each container's images
        setInterval(changeImage, 2000);
    });
});


