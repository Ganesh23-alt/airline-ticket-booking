document.addEventListener("DOMContentLoaded", function () {
  // Fetch the navbar HTML file and load it into the placeholder
  fetch("/navbar.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load navbar HTML.");
      }
      return response.text();
    })
    .then((data) => {
        console.log(data);
      document.getElementById("navbar-placeholder").innerHTML = data;
      updateNavbar(); 
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});

// Function to dynamically update the navbar based on user login status
function updateNavbar() {
  const userEmail = localStorage.getItem("userEmail"); // Retrieve user email from localStorage
  const centerLinks = document.getElementById("centerLinks");
  const authLinks = document.getElementById("authLinks");

  // Center links: Static content for all users
  centerLinks.innerHTML = `
    <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        Flights
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li><a class="dropdown-item" href="/flights">Flight Listing</a></li>
        <li><a class="dropdown-item" href="/bookings">Flight Booking</a></li>
      </ul>
    </li>
  `;

  // Auth links: Change based on whether user is logged in or not
  if (userEmail) {
    // If logged in, display user-specific options
    const userName = userEmail.split("@")[0];
    authLinks.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Hello, ${userName}
        </a>
        <ul class="dropdown-menu" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="/profile">My Profile</a></li>
          <li class="dropdown-item"><a href="/bookings">Your Bookings</a></li>
          <li class="dropdown-item"><a href="/wishlist">Wishlist</a></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
        </ul>
      </li>
    `;
  } else {
    // If not logged in, display login and signup options
    authLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link font-weight-bold" href="/login">Login</a></li>
      <li class="nav-item"><a class="nav-link font-weight-bold" href="/register">Signup</a></li>
    `;
  }
}

// Function to handle user logout
function logout() {
  try {
    // Remove user data from localStorage and refresh the navbar
    localStorage.removeItem("userEmail");
    alert("You have been logged out successfully!");
    updateNavbar(); // Refresh navbar content after logout
  } catch (error) {
    console.error("Error during logout:", error);
    alert("Logout failed. Please try again.");
  }
}
