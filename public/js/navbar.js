document.addEventListener("DOMContentLoaded", function () {
  // Load the navbar HTML file and insert it into the placeholder
  fetch("/navbar")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load navbar HTML.");
      }
      return response.text();
    })
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      updateNavbar(); // Call function to update navbar based on login status
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});

// Function to dynamically update the navbar
function updateNavbar() {
  const userEmail = localStorage.getItem("userEmail"); // Retrieve user email from localStorage
  const authLinks = document.getElementById("authLinks");

  if (!authLinks) {
    console.error("Navbar placeholders not found.");
    return;
  }

  // Update authentication links based on login status
  if (userEmail) {
    // User logged in: Show personalized options
    const userName = userEmail.split("@")[0];
    authLinks.innerHTML = `
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Hello, ${userName}
        </a>
        <ul class="dropdown-menu" aria-labelledby="userDropdown">
          <li><a class="dropdown-item" href="/profile">My Profile</a></li>
          <li><a class="dropdown-item" href="/cart">Cart</a></li>
          <li><a class="dropdown-item" href="#" onclick="logout()">Logout</a></li>
        </ul>
      </li>
    `;
  } else {
    // User not logged in: Show Login and Signup options
    authLinks.innerHTML = `
      <li class="nav-item"><a class="nav-link" href="/login">Login</a></li>
      <li class="nav-item"><a class="nav-link" href="/register">Signup</a></li>
    `;
  }
}

// Function to handle logout
function logout() {
  try {
    // Clear user email from localStorage
    localStorage.removeItem("userEmail");
    window.location.href = '/';
    updateNavbar(); // Refresh navbar after logout
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
