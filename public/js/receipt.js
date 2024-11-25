window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html'; // Redirect if not logged in
    }

    const user = JSON.parse(atob(token.split('.')[1])); // Decode token to get user data

    // Fetch booking data to display the receipt
    fetch('/data/booking.json')
        .then(response => response.json())
        .then(bookings => {
            const lastBooking = bookings[bookings.length - 1]; // Get the last booking made
            displayReceipt(lastBooking); // Display the receipt on the page
        })
        .catch(err => console.error("Error loading booking data:", err));

    function displayReceipt(booking) {
        const receiptDetails = document.getElementById("receiptDetails");
        receiptDetails.innerHTML = `
            <h3>Booking Confirmed</h3>
            <p><strong>Flight ID:</strong> ${booking.flightId}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Seats:</strong> ${booking.seats}</p>
            <p><strong>Payment Details:</strong> Card ending in ${booking.cardNumber.slice(-4)}</p>
            <p><strong>Booking Date:</strong> ${booking.date}</p>
        `;
    }

    // Event listener for the download receipt button
    document.getElementById("downloadReceiptBtn").addEventListener('click', function () {
        fetch('/data/booking.json')
            .then(response => response.json())
            .then(bookings => {
                const lastBooking = bookings[bookings.length - 1]; // Get the last booking made
                
                // Generate the receipt PDF
                const doc = new jsPDF();
                doc.text("Booking Receipt", 20, 20);
                doc.text("Flight ID: " + lastBooking.flightId, 20, 30);
                doc.text("Name: " + lastBooking.name, 20, 40);
                doc.text("Email: " + lastBooking.email, 20, 50);
                doc.text("Seats: " + lastBooking.seats, 20, 60);
                doc.text("Booking Date: " + lastBooking.date, 20, 70);
                doc.text("Payment: Card ending in " + lastBooking.cardNumber.slice(-4), 20, 80);
                
                // Save the generated PDF
                doc.save("booking_receipt.pdf");
                
                // Redirect to the dashboard after downloading the receipt
                window.location.href = '/dashboard.html';
            })
            .catch(err => console.error("Error loading booking data:", err));
    });
});
