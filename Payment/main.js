function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function clearCart() {
  localStorage.removeItem("cart");
}

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
    clearCart();
    window.location.href = "../index.html";
  }, 2500);
});

renderSummary();
