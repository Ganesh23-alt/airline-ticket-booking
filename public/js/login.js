document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/api/login", { // Ensure the correct endpoint
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            return Promise.reject("Login failed: " + response.statusText);
        }
        return response.json(); // Parse JSON response if status is OK
    })
    .then(data => {
        Toastify({
  text: data.message,
  duration: 3000,
  close: true, 
  gravity: "top", 
  position: "right", 
  backgroundColor: "#4CAF50",
}).showToast();;
        if (data.token) {
            localStorage.setItem('token', data.token); // Store token in local storage
            localStorage.setItem('userEmail', data.email); // Store user email

            window.location.href = '/'; // Redirect to index
        }
    })
    .catch(err => {
        console.error('Error:', err);
        Toastify({
  text: "Login Failed",
  duration: 3000,
  close: true, 
  gravity: "top", 
  position: "right", 
  backgroundColor: "#4CAF50",
}).showToast();
    });
});
