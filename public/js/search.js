document.getElementById("searchForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const destination = document.getElementById("destination").value.toLowerCase();
    const date = document.getElementById("date").value;

    console.log(destination);
    console.log(date);

    // Fetch flights data from the server
    fetch("/data/flights.json")
        .then(response => response.json())
        .then(flights => {
            const filteredFlights = flights.filter(flight => {
                return flight.destination.toLowerCase().includes(destination);
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
                                    <a href="/booking.html?flightId=${flight.id}" class="btn btn-primary">Book Now</a>
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
