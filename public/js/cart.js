document.addEventListener("DOMContentLoaded", function () {
    const cartItemsList = document.getElementById("cartItemsList");
    const clearCartButton = document.getElementById("clearCartButton");
    const checkoutButton = document.getElementById("proceedToCheckoutButton");

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

    // Proceed to checkout
    proceedToCheckoutButton.addEventListener("click", () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty. Add items to proceed.");
    } else {
      // Store cart data in sessionStorage for the payment page
      sessionStorage.setItem("cart", JSON.stringify(cart));

      // Redirect to the payment page
      window.location.href = "/payment"; // Assuming the payment page is '/payment'
    }
  });

  // Initial Load of Cart Items
  loadCartItems();
    });

