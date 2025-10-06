function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function clearCart() {
  localStorage.removeItem("cart");
}

// ✅ Record a purchase (used by checkout)
function recordPurchase(purchaseData) {
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  purchases.push(purchaseData);
  localStorage.setItem("purchases", JSON.stringify(purchases));

  // Update product stock or pre-order status
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find(p => p.name === purchaseData.product);
  if (product) {
    if (product.type === "in-stock") {
      product.stock = Math.max(0, (product.stock || 0) - (purchaseData.quantity || 1));
    } else if (product.type === "pre-order") {
      product.preOrdersMade = (product.preOrdersMade || 0) + (purchaseData.quantity || 1);
    }
  }
  localStorage.setItem("products", JSON.stringify(products));
}

// ✅ Render the checkout summary
function renderSummary() {
  const cart = getCart();
  const summary = document.getElementById("orderSummary");
  const totalBox = document.getElementById("orderTotal");

  if (cart.length === 0) {
    summary.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
    totalBox.textContent = "Rp. 0";
    return;
  }

  let total = 0;
  summary.innerHTML = "";
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    summary.innerHTML += `
      <div class="summary-item d-flex justify-content-between">
        <span>${item.name} x${item.qty}</span>
        <span>Rp. ${subtotal.toLocaleString()}</span>
      </div>`;
  });
  totalBox.textContent = "Rp. " + total.toLocaleString();
}

// ✅ Handle Checkout Payment Simulation
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Show center success modal
  const modal = document.getElementById("successModal");
  modal.classList.add("show");

  // Simulated successful payment
  setTimeout(() => {
    const today = new Date().toISOString().split("T")[0];

    // Record each product from cart as a purchase
    cart.forEach(item => {
      const purchase = {
        product: item.name,
        buyer: "Guest",
        type: item.type || "in-stock",
        quantity: item.qty,
        total: item.price * item.qty,
        date: today
      };
      recordPurchase(purchase);
    });

    clearCart();
    window.location.href = "../index.html";
  }, 2500);
});

renderSummary();
