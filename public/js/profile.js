document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const userNameSpan = document.getElementById("userName");
  const userEmailSpan = document.getElementById("userEmail");
  const userPhoneSpan = document.getElementById("userPhone");
  const userAddressSpan = document.getElementById("userAddress");
  const historyTableBody = document.querySelector("#historyTable tbody");
  const cartCountSpan = document.getElementById("cartCount");
  const cartButton = document.getElementById("cartButton");

  // Fetch user email from localStorage
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    console.warn("User is not logged in.");
    cartCountSpan.textContent = "0";
    return;
  }

  // Display user email
  userEmailSpan.textContent = userEmail;

  // Load User Info
  fetch("/data/users.json")
    .then((response) => response.json())
    .then((users) => {
      const user = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
      if (user) {
        userNameSpan.textContent = user.name;
        userPhoneSpan.textContent = user.phone || "N/A";
        userAddressSpan.textContent = user.countryCode || "N/A";
      }
    })
    .catch((error) => console.error("Error loading user info:", error));

  // Load Booking History
  fetch("/data/booking.json")
    .then((response) => response.json())
    .then((bookings) => {
      const userBookings = bookings.filter((b) => b.email.toLowerCase() === userEmail.toLowerCase());
      if (userBookings.length > 0) {
        fetch("/data/flights.json")
          .then((response) => response.json())
          .then((flights) => {
            userBookings.forEach((booking) => {
              const flight = flights.find((f) => f.id === parseInt(booking.flightId));
              if (flight) {
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td>${flight.name}</td>
                  <td>${flight.airline}</td>
                  <td>${flight.destination}</td>
                  <td>${flight.departure}</td>
                  <td>${flight.arrival}</td>
                  <td>${flight.class}</td>
                  <td>${booking.seats}</td>
                  <td>
                    <button class="btn btn-warning btn-sm addToCart-btn" data-flight-id="${flight.id}" data-flight-name="${flight.name}" data-flight-class="${flight.class}" data-flight-price="${flight.price}">Add to Cart</button>
                    <button class="btn btn-danger btn-sm removeFlight-btn" data-flight-id="${flight.id}">Remove</button>
                  </td>
                `;
                historyTableBody.appendChild(row);
              }
            });
          })
          .catch((error) => console.error("Error loading flight info:", error));
      }
    })
    .catch((error) => console.error("Error loading booking history:", error));

  // Handle Add to Cart and Remove actions
  historyTableBody.addEventListener("click", (event) => {
    const target = event.target;

    // Add to Cart
    if (target.classList.contains("addToCart-btn")) {
      const flightId = target.getAttribute("data-flight-id");
      const flightName = target.getAttribute("data-flight-name");
      const flightClass = target.getAttribute("data-flight-class");
      const flightPrice = parseFloat(target.getAttribute("data-flight-price")); // Ensure price is a float

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ flightId, flightName, flightClass, price: flightPrice });
      localStorage.setItem("cart", JSON.stringify(cart));

      updateCartCount();
    }

    // Remove Flight
    if (target.classList.contains("removeFlight-btn")) {
      const flightId = target.getAttribute("data-flight-id");

      fetch("/data/booking.json")
        .then((response) => response.json())
        .then((bookings) => {
          const updatedBookings = bookings.filter(
            (b) => !(b.email.toLowerCase() === userEmail.toLowerCase() && b.flightId === flightId)
          );

          // Simulate saving updated bookings back to the file
          console.log("Updated Bookings:", updatedBookings);

          // Remove the row from the table
          target.closest("tr").remove();
        })
        .catch((error) => console.error("Error removing flight:", error));
    }
  });

  // Redirect to Cart Page
  cartButton.addEventListener("click", () => {
    window.location.href = "/cart.html"; // Redirect to the cart page
  });

  // Update Cart Count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCountSpan.textContent = cart.length;
  }

  // Initial Load
  updateCartCount();
});
