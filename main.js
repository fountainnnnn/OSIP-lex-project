// Default demo products (with stock + pre-order)
const defaultProducts = [
  { name: "Advent Circle", category: "Handycrafts", price: 200000, stock: 5, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JBF1XTZXP1D28KSBSXSP4TM4.jpg" },
  { name: "Bouquet", category: "Handycrafts", price: 200000, stock: 3, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JN30P3AVQEMB8CQDNTG7ZDRP.jpg" },
  { name: "Tissue Box", category: "Handycrafts", price: 50000, stock: 8, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JN30A7X7P8GM65XJBWN1HPD4.jpg" },
  { name: "Flower Bouquet", category: "Handycrafts", price: 200000, stock: 2, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JBF3C2NBQMWM0VFVCHWZ44AC.jpg" },
  { name: "Christmas Ornaments", category: "Handycrafts", price: 50000, stock: 10, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JBF4BMX7WR907T8AGHJ7BREB.jpg" },
  { name: "Custom Wooden Frame", category: "Handycrafts", price: 250000, type: "pre-order", img: "" }
];

// Fallback image
const defaultImg = "https://preyash2047.github.io/assets/img/no-preview-available.png?h=824917b166935ea4772542bec6e8f636";

// Load products from localStorage + defaults
function loadProducts() {
  const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const allProducts = mergeWithDefaults(defaultProducts, savedProducts);
  const container = document.getElementById("productList");
  container.innerHTML = "";

  allProducts.forEach((p, index) => {
    const imageSrc = p.img && p.img.trim() !== "" ? p.img : defaultImg;
    const outOfStock = p.type === "in-stock" && p.stock <= 0;

    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3"; // full width on mobile

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imageSrc}" class="card-img-top" alt="${p.name}" onerror="this.src='${defaultImg}'">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${p.name}</h5>
            <p class="text-muted">${p.category}</p>
            <p class="fw-bold text-success">Rp. ${p.price.toLocaleString()}</p>
            ${p.type === "in-stock"
              ? `<p class="text-secondary small mb-2">Stock: 
                  <span id="stock-${index}" class="${outOfStock ? 'text-danger fw-bold' : 'text-success'}">
                    ${p.stock > 0 ? p.stock : 'Out of Stock'}
                  </span></p>`
              : `<p class="text-primary small mb-2 fw-bold">Pre-order item</p>`}
          </div>
          <button 
            class="btn ${outOfStock ? 'btn-secondary' : 'btn-outline-success'} mt-2 buy-btn"
            data-index="${index}"
            ${outOfStock ? 'disabled' : ''}
            data-name="${p.name}"
            data-price="${p.price}">
            ${outOfStock ? 'Out of Stock' : 'Buy'}
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  localStorage.setItem("products", JSON.stringify(allProducts));

  // Attach Buy listeners
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", openPurchaseModal);
  });
}

// Merge defaults with local ones
function mergeWithDefaults(defaults, saved) {
  const combined = [...defaults];
  saved.forEach(savedItem => {
    const existing = combined.find(d => d.name === savedItem.name);
    if (existing) Object.assign(existing, savedItem);
    else combined.push(savedItem);
  });
  return combined;
}

// ---- MODAL HANDLING ----

// Create modal dynamically once
function createPurchaseModal() {
  if (document.getElementById("purchaseModal")) return; // already exists

  const modalHTML = `
    <div class="modal fade" id="purchaseModal" tabindex="-1" aria-labelledby="purchaseModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="purchaseModalLabel">Confirm Purchase</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div id="modalProductInfo" class="mb-3"></div>
            <form id="purchaseForm">
              <div class="mb-3">
                <label class="form-label">Buyer Name</label>
                <input type="text" class="form-control" id="buyerName" placeholder="Enter name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-control" id="purchaseQty" min="1" value="1" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-success" id="confirmPurchaseBtn">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Open modal and fill info
function openPurchaseModal(e) {
  createPurchaseModal();

  const index = e.target.getAttribute("data-index");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const p = products[index];

  const modalBody = document.getElementById("modalProductInfo");
  modalBody.innerHTML = `
    <h6>${p.name}</h6>
    <p class="mb-1 text-muted">${p.category}</p>
    <p class="mb-1 fw-bold text-success">Rp. ${p.price.toLocaleString()}</p>
    <p class="small text-${p.type === "in-stock" ? "secondary" : "primary"} mb-0">
      ${p.type === "in-stock" ? `Stock available: ${p.stock}` : "Pre-order item"}
    </p>
  `;

  const qtyInput = document.getElementById("purchaseQty");
  qtyInput.max = p.stock || 99;
  qtyInput.value = 1;

  // Open modal
  const modal = new bootstrap.Modal(document.getElementById("purchaseModal"));
  modal.show();

  // Confirm button listener
  document.getElementById("confirmPurchaseBtn").onclick = function () {
    const buyerName = document.getElementById("buyerName").value.trim() || "Anonymous";
    let qty = parseInt(document.getElementById("purchaseQty").value) || 1;

    if (p.type === "in-stock" && qty > p.stock) {
      alert("Not enough stock available!");
      return;
    }

    handlePurchase(p, index, qty, buyerName);
    modal.hide();
  };
}

// ---- ACTUAL PURCHASE LOGIC ----
function handlePurchase(product, productIndex, quantity, buyer) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

  // Adjust stock if needed
  if (product.type === "in-stock") {
    products[productIndex].stock -= quantity;
  }

  const newPurchase = {
    product: product.name,
    buyer: buyer,
    type: product.type,
    amount: product.price,
    quantity: quantity,
    total: product.price * quantity,
    date: new Date().toISOString().split("T")[0]
  };

  purchases.push(newPurchase);
  localStorage.setItem("purchases", JSON.stringify(purchases));
  localStorage.setItem("products", JSON.stringify(products));

  // Update UI
  loadProducts();
  alert(`Purchase recorded!\n${quantity}x ${product.name} bought by ${buyer}.`);
}

window.onload = loadProducts;
