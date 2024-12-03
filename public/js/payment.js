document.addEventListener("DOMContentLoaded", function () {
  const checkoutCartItemsList = document.getElementById("checkoutCartItems");
  const totalPriceSpan = document.getElementById("totalPrice");
  const completePurchaseButton = document.getElementById("completePurchaseButton");
  const userNameInput = document.getElementById("userName");
  const userEmailInput = document.getElementById("userEmail");
  const userAddressInput = document.getElementById("userAddress");
  const paymentMethodRadio = document.getElementsByName("paymentMethod");
  const creditCardDetails = document.getElementById("creditCardDetails");
  const paypalDetails = document.getElementById("paypalDetails");

  // Load Cart Items from Session Storage
  function loadCartItems() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    console.log("Cart data:", cart); // Debugging the cart data

    // Check if cart is empty
    if (cart.length === 0) {
      checkoutCartItemsList.innerHTML = "<li class='list-group-item'>Your cart is empty.</li>";
      totalPriceSpan.textContent = "$0.00";
      return;
    }

    let totalAmount = 0;
    checkoutCartItemsList.innerHTML = "";

    cart.forEach(item => {
      const flightName = item.flightName || "Unknown Flight";
      const flightClass = item.flightClass || "Unknown Class";
      const price = parseFloat(item.price);
      const validPrice = isNaN(price) ? 0 : price; // Fallback to 0 if price is invalid

      const listItem = document.createElement("li");
      listItem.classList.add("list-group-item");
      listItem.textContent = `${flightName} (${flightClass}) - $${validPrice.toFixed(2)}`;
      checkoutCartItemsList.appendChild(listItem);

      totalAmount += validPrice;
    });

    totalPriceSpan.textContent = `$${totalAmount.toFixed(2)}`;
  }

  // Toggle Payment Method (Credit Card / PayPal)
  paymentMethodRadio.forEach(radio => {
    radio.addEventListener("change", () => {
      if (document.getElementById("creditCard").checked) {
        creditCardDetails.style.display = "block";
        paypalDetails.style.display = "none";
      } else {
        creditCardDetails.style.display = "none";
        paypalDetails.style.display = "block";
      }
    });
  });

  // Complete Purchase Button Logic
  completePurchaseButton.addEventListener("click", () => {
    const userName = userNameInput.value.trim();
    const userEmail = userEmailInput.value.trim();
    const userAddress = userAddressInput.value.trim();

    if (!userName || !userEmail || !userAddress) {
      // alert("Please fill in all user details.");
      return;
    }

    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPaymentMethod) {
      // alert("Please select a payment method.");
      return;
    }

    // Collect cart details from sessionStorage
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Save the finalized order details to sessionStorage
    const orderDetails = {
      userName: userName,
      userEmail: userEmail,
      cart: cart
    };
    console.log("Order being saved to sessionStorage:", orderDetails);  // Debugging line
    sessionStorage.setItem("order", JSON.stringify(orderDetails));

    // Clear Cart after Purchase
    sessionStorage.removeItem("cart");
    window.location.href = "/thank-you"; // Redirect to the Thank You page
  });

  // Initial Load of Cart Items
  loadCartItems();
});
