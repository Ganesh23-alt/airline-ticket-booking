window.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }

    const user = JSON.parse(atob(token.split('.')[1])); // Decode token

    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');

    fetch('/data/booking.json')
        .then((response) => response.json())
        .then((bookings) => {
            const booking = bookings.find((b) => b.id === bookingId); // Find booking by ID
            if (booking) {
                displayReceipt(booking);
            } else {
                console.error("Booking not found.");
                document.getElementById("receiptDetails").innerHTML = `
                    <p class="text-danger">Booking not found.</p>
                `;
            }
        })
        .catch((err) => console.error("Error loading booking data:", err));

    function displayReceipt(booking) {
        const receiptDetails = document.getElementById("receiptDetails");
        receiptDetails.innerHTML = `
            <h3>Booking Confirmed</h3>
            <p><strong>Flight ID:</strong> ${booking.flightId}</p>
            <p><strong>Name:</strong> ${booking.name}</p>
            <p><strong>Email:</strong> ${booking.email}</p>
            <p><strong>Seats:</strong> ${booking.seats}</p>
            <p><strong>Booking Date:</strong> ${booking.date}</p>
        `;
    }

    document.getElementById("downloadReceiptBtn").addEventListener('click', function () {
        fetch('/data/booking.json')
            .then(response => response.json())
            .then(bookings => {
                const booking = bookings.find(b => b.id === bookingId);
                if (booking) {
                    const doc = new jsPDF();
                    doc.text("Booking Receipt", 20, 20);
                    doc.text("Flight ID: " + booking.flightId, 20, 30);
                    doc.text("Name: " + booking.name, 20, 40);
                    doc.text("Email: " + booking.email, 20, 50);
                    doc.text("Seats: " + booking.seats, 20, 60);
                    doc.text("Booking Date: " + booking.date, 20, 70);
                    doc.save("booking_receipt.pdf");
                    window.location.href = '/dashboard.html';
                } else {
                    alert("Booking not found. Cannot download receipt.");
                }
            })
            .catch(err => console.error("Error loading booking data:", err));
    });
});
