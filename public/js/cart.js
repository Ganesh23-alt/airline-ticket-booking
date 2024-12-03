document.addEventListener("DOMContentLoaded", function () {
    const cartItemsList = document.getElementById("cartItemsList");
    const clearCartButton = document.getElementById("clearCartButton");
    const checkoutButton = document.getElementById("proceedToCheckoutButton");

    const confirmationModal = document.getElementById("confirmationModal");
    const confirmCheckoutButton = document.getElementById("confirmCheckout");
    const cancelCheckoutButton = document.getElementById("cancelCheckout");

    // Load cart items from localStorage
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartItemsList.innerHTML = ""; // Clear the existing items

        if (cart.length === 0) {
            cartItemsList.innerHTML = `<tr><td colspan="3" class="text-center">Your cart is empty.</td></tr>`;
        } else {
            cart.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.flightName}</td>
                    <td>${item.flightClass}</td>
                    <td><button class="btn btn-danger btn-sm removeItem" data-flight-id="${item.flightId}">Remove</button></td>
                `;
                cartItemsList.appendChild(row);
            });
        }
    }

    // Remove item from cart
    cartItemsList.addEventListener("click", (event) => {
        if (event.target.classList.contains("removeItem")) {
            const flightId = event.target.getAttribute("data-flight-id");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart = cart.filter(item => item.flightId !== flightId);
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCartItems();  // Re-render cart items
        }
    });

    // Clear the cart
    clearCartButton.addEventListener("click", () => {
        localStorage.removeItem("cart");
        loadCartItems();  // Re-render cart items
    });

    // Proceed to checkout with custom modal
    checkoutButton.addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        if (cart.length === 0) {
            alert("Your cart is empty. Add items to proceed.");
        } else {
            // Show confirmation modal
            confirmationModal.style.display = "block";
        }
    });

    // Confirm checkout action
    confirmCheckoutButton.addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        sessionStorage.setItem("cart", JSON.stringify(cart)); // Store cart data in sessionStorage
        window.location.href = "/payment"; // Redirect to payment page
    });

    // Cancel checkout action
    cancelCheckoutButton.addEventListener("click", () => {
        confirmationModal.style.display = "none"; // Close the modal
    });

    // Initial Load of Cart Items
    loadCartItems();
});
