document.addEventListener("DOMContentLoaded", function () {
  // Retrieve order details from sessionStorage
  const orderDetails = JSON.parse(sessionStorage.getItem("order"));
  console.log("Order retrieved from sessionStorage:", orderDetails); // Debugging line

  if (!orderDetails || !orderDetails.cart || orderDetails.cart.length === 0) {
    console.error("No finalized order found in sessionStorage!");
    document.getElementById("ticketDetails").innerHTML = "<p>Your order could not be found. Please try again.</p>";
    return;
  }

  const userName = orderDetails.userName || "Unknown User";
  const userEmail = orderDetails.userEmail || "Unknown Email";
  const cartItems = orderDetails.cart || [];
  let totalPrice = 0;

  // Ensure all required elements are present before attempting to set their values
  const userNameElement = document.getElementById("userName");
  const userEmailElement = document.getElementById("userEmail");
  const flightNameElement = document.getElementById("flightName");
  const flightClassElement = document.getElementById("flightClass");
  const priceElement = document.getElementById("price");

  if (!userNameElement || !userEmailElement || !flightNameElement || !flightClassElement || !priceElement) {
    console.error("One or more required elements are missing in the HTML.");
    return;
  }

  // Set user details
  userNameElement.textContent = userName;
  userEmailElement.textContent = userEmail;

  let flightDetailsHTML = "";
  cartItems.forEach(item => {
    const flightName = item.flightName || "Unknown Flight";
    const flightClass = item.flightClass || "Unknown Class";
    const price = parseFloat(item.price) || 0;
    totalPrice += price;

    flightDetailsHTML += `
      <p><strong>Flight Name:</strong> ${flightName}</p>
      <p><strong>Flight Class:</strong> ${flightClass}</p>
      <p><strong>Price:</strong> $${price.toFixed(2)}</p>
      <hr>
    `;
  });

  // Display ticket details
  document.getElementById("ticketDetails").innerHTML = flightDetailsHTML;
  priceElement.textContent = totalPrice.toFixed(2);

  // Print PDF functionality
  document.getElementById("printPdfButton").addEventListener("click", function () {
    // Access jsPDF properly
    const { jsPDF } = window.jspdf;  // Destructure the jsPDF object correctly

    // Initialize jsPDF instance using the correct constructor syntax
    const doc = new jsPDF();

    // Set document title
    doc.setFontSize(18);
    doc.text("Flight Ticket", 20, 20);

    // Add user and flight details to the PDF
    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 20, 30);
    doc.text(`Email: ${userEmail}`, 20, 40);

    let yOffset = 50;
    cartItems.forEach(item => {
      const flightName = item.flightName || "Unknown Flight";
      const flightClass = item.flightClass || "Unknown Class";
      const price = parseFloat(item.price) || 0;

      doc.text(`Flight Name: ${flightName}`, 20, yOffset);
      doc.text(`Flight Class: ${flightClass}`, 20, yOffset + 10);
      doc.text(`Price: $${price.toFixed(2)}`, 20, yOffset + 20);

      yOffset += 30;
    });

    doc.text(`Total Price: $${totalPrice.toFixed(2)}`, 20, yOffset + 10);

    // Save the generated PDF
    doc.save('flight-ticket.pdf');
  });
});
