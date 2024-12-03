document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const countryCode = document.getElementById("countryCode").value;

    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone, countryCode }),
    })
    .then(response => response.json())
    .then(data => {
        // alert(data.message);
        if (data.message === "User registered successfully.") {
            window.location.href = '/login.html';
        }
    })
    .catch(err => console.log('Error:', err));
});
