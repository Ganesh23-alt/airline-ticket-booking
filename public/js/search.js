document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const destination = document.getElementById("destination").value.toLowerCase();
    const date = document.getElementById("date").value;
    const searchDate = new Date(date.split('/').reverse().join('-')).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    console.log(destination);
    console.log(date);

    // Fetch flights data from the server
    fetch("/data/flights.json")
        .then(response => response.json())
        .then(flights => {
            const filteredFlights = flights.filter(flight => {
                // console.log(flight.departure)
                // console.log(flight.destination.toLowerCase())
                // console.log(searchDate)
                // const departureDate = new Date(flight.departure).toISOString().split('T')[0]; 
                return flight.destination.toLowerCase().includes(destination) 
                // && flight.departureDate == searchDate;z
            });
            console.log(filteredFlights);

            // Clear previous results
            const resultsContainer = document.getElementById("searchResults");
            resultsContainer.innerHTML = "";

            // Display search results
            if (filteredFlights.length === 0) {
                resultsContainer.innerHTML = `<div class="col-12"><p class="text-center">No flights found for your search criteria.</p></div>`;
            } else {
                filteredFlights.forEach(flight => {
                    const flightCard = `
                        <div class="col-md-4">
                            <div class="card">
                                <img src="/assets/images/${flight.image}" class="card-img-top" alt="Flight Image">
                                <div class="card-body">
                                    <h5 class="card-title">${flight.name}</h5>
                                    <p class="card-text">
                                        Destination: ${flight.destination}<br>
                                        Departure: ${flight.departure}<br>
                                        Arrival: ${flight.arrival}<br>
                                        Price: $${flight.price}
                                    </p>
                                    <a href="/booking.html" class="btn btn-primary" id="bookFlightBtn">Book Now</a>
                                </div>
                            </div>
                        </div>
                    `;
                    resultsContainer.innerHTML += flightCard;
                });
            }
        })
        .catch(err => console.log("Error:", err));
});
