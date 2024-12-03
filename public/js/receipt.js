window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }

    const user = JSON.parse(atob(token.split('.')[1])); // Decode token

    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');

    // Fetch booking data
    fetch('/data/booking.json')
        .then((response) => response.json())
        .then((bookings) => {
            const booking = bookings.find((b) => b.id === bookingId); // Find booking by ID
            if (booking) {
                // Fetch flight data once booking is found
                fetch('/data/flights.json')
                    .then((response) => response.json())
                    .then((flights) => {
                        const flight = flights.find(f => f.id == booking.flightId); // Find flight by flightId
                        if (flight) {
                            displayReceipt(booking, flight);
                        } else {
                            console.error("Flight not found.");
                            document.getElementById("receiptDetails").innerHTML = `
                                <p class="text-danger">Flight details not found.</p>
                            `;
                        }
                    })
                    .catch((err) => console.error("Error loading flight data:", err));
            } else {
                console.error("Booking not found.");
                document.getElementById("receiptDetails").innerHTML = `
                    <p class="text-danger">Booking not found.</p>
                `;
            }
        })
        .catch((err) => console.error("Error loading booking data:", err));

    function displayReceipt(booking, flight) {
        const receiptDetails = document.getElementById("receiptDetails");
        receiptDetails.innerHTML = `
            <h3>Booking Confirmed</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Flight ID:</strong> ${flight.name}</p>
            <p><strong>Airline:</strong> ${flight.airline}</p>
            <p><strong>Destination:</strong> ${flight.destination}</p>
            <p><strong>Departure:</strong> ${new Date(flight.departure).toLocaleString()}</p>
            <p><strong>Arrival:</strong> ${new Date(flight.arrival).toLocaleString()}</p>
            <p><strong>Flight Class:</strong> ${flight.class}</p>
            <p><strong>Seats:</strong> ${booking.seats}</p>
            <p><strong>Booking Date:</strong> ${new Date(booking.date).toLocaleString()}</p>
            <p><strong>Price:</strong> $${flight.price}</p>
            <button id="checkoutBtn" class="btn btn-success">Proceed to Checkout</button> <!-- Proceed to Checkout Button -->
        `;
        
        // Add event listener for Proceed to Checkout
        document.getElementById("checkoutBtn").addEventListener('click', function () {
            // Redirect to payment page with bookingId in the URL
            window.location.href = `/payment.html?bookingId=${booking.id}`;
        });
    }

    // Download receipt
    document.getElementById("downloadReceiptBtn").addEventListener('click', function () {
        fetch('/data/booking.json')
            .then(response => response.json())
            .then(bookings => {
                const booking = bookings.find(b => b.id === bookingId);
                if (booking) {
                    fetch('/data/flights.json')
                        .then(response => response.json())
                        .then(flights => {
                            const flight = flights.find(f => f.id == booking.flightId);
                            if (flight) {
                                const doc = new jsPDF();
                                doc.text("Booking Receipt", 20, 20);
                                doc.text("Booking ID: " + booking.id, 20, 30);
                                doc.text("Flight ID: " + flight.name, 20, 40);
                                doc.text("Airline: " + flight.airline, 20, 50);
                                doc.text("Destination: " + flight.destination, 20, 60);
                                doc.text("Departure: " + new Date(flight.departure).toLocaleString(), 20, 70);
                                doc.text("Arrival: " + new Date(flight.arrival).toLocaleString(), 20, 80);
                                doc.text("Seats: " + booking.seats, 20, 90);
                                doc.text("Price: $" + flight.price, 20, 100);
                                doc.text("Booking Date: " + new Date(booking.date).toLocaleString(), 20, 110);
                                doc.save("booking_receipt.pdf");
                                window.location.href = '/dashboard.html';
                            } else {
                                // alert("Flight details not found. Cannot download receipt.");
                            }
                        })
                        .catch(err => console.error("Error loading flight data:", err));
                } else {
                    // alert("Booking not found. Cannot download receipt.");
                }
            })
            .catch(err => console.error("Error loading booking data:", err));
    });
});
