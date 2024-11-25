window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    
    // Check if the user is not logged in
    if (!token) {
        window.location.href = '/login.html'; // Redirect to login page
        return; // Exit the function if not logged in
    }

    try {
        // Decode the token and get user information
        const user = JSON.parse(atob(token.split('.')[1]));
        
        // Display logged-in user's email
        const userEmailElement = document.getElementById("userEmail");
        if (userEmailElement) {
            userEmailElement.innerText = `Logged in as: ${user.email}`;
        }
    } catch (err) {
        console.error("Invalid token:", err);
        window.location.href = '/login.html'; // Redirect to login page if token is invalid
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const flightId = urlParams.get('flightId');
    
    fetch('/data/flights.json')
        .then(response => response.json())
        .then(flights => {
            const flight = flights.find(f => f.id == flightId);
            if (flight) {
                displayFlightDetails(flight);
            }
        })
        .catch(err => console.error("Error loading flight data:", err));

    // Display selected flight details
    function displayFlightDetails(flight) {
        const flightDetails = document.getElementById("flightDetails");
        flightDetails.innerHTML = `
            <div class="col-md-12">
                <div class="card">
                    <img src="/assets/images/${flight.image}" class="card-img-top" alt="Flight Image">
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
        document.getElementById("flightId").value = flight.id;
    }

    // Handle form submission
    document.getElementById("bookingFormFields").addEventListener('submit', function (e) {
        e.preventDefault();

        const flightId = document.getElementById("flightId").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const seats = document.getElementById("seats").value;
        const cardNumber = document.getElementById("cardNumber").value;
        const expiryDate = document.getElementById("expiryDate").value;
        const cvv = document.getElementById("cvv").value;

        const booking = {
            flightId,
            name,
            email,
            seats,
            cardNumber,
            expiryDate,
            cvv,
            date: new Date().toLocaleString()
        };

        // Save booking data (In real-world scenario, this would be saved to a server)
        fetch('/api/confirmBooking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(booking)
        })
        .then(response => response.json())
        .then(() => {
            window.location.href = '/receipt.html'; // Redirect to receipt page after booking
        })
        .catch(err => console.error("Error saving booking data:", err));
    });
});
