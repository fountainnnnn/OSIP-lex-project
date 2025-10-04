// Default demo products (now with stock and pre-order types)
const defaultProducts = [
  { name: "Advent Circle", category: "Handycrafts", price: 200000, stock: 5, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JBF1XTZXP1D28KSBSXSP4TM4.jpg" },
  { name: "Bouquet", category: "Handycrafts", price: 200000, stock: 3, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JN30P3AVQEMB8CQDNTG7ZDRP.jpg" },
  { name: "Tissue Box", category: "Handycrafts", price: 50000, stock: 8, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JN30A7X7P8GM65XJBWN1HPD4.jpg" },
  { name: "Flower Bouquet", category: "Handycrafts", price: 200000, stock: 2, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JBF3C2NBQMWM0VFVCHWZ44AC.jpg" },
  { name: "Christmas Ornaments", category: "Handycrafts", price: 50000, stock: 10, type: "in-stock", img: "https://daoerzenee.com/storage/products/01JBF4BMX7WR907T8AGHJ7BREB.jpg" },
  { name: "Custom Wooden Frame", category: "Handycrafts", price: 250000, type: "pre-order", img: "" }
];

// Default image for missing or no-preview items
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
    card.className = "col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imageSrc}" class="card-img-top" alt="${p.name}" onerror="this.src='${defaultImg}'">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${p.name}</h5>
            <p class="text-muted">${p.category}</p>
            <p class="fw-bold text-success">Rp. ${p.price.toLocaleString()}</p>
            ${p.type === "in-stock" ? `
              <p class="text-secondary small mb-2">Stock: 
                <span id="stock-${index}" class="${outOfStock ? 'text-danger fw-bold' : 'text-success'}">
                  ${p.stock > 0 ? p.stock : 'Out of Stock'}
                </span>
              </p>
            ` : `
              <p class="text-primary small mb-2 fw-bold">Pre-order item</p>
            `}
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

  // Save merged state
  localStorage.setItem("products", JSON.stringify(allProducts));

  // Attach Buy button listeners
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", handlePurchase);
  });
}

// Merge defaults with saved, preserving custom edits
function mergeWithDefaults(defaults, saved) {
  const combined = [...defaults];
  saved.forEach(savedItem => {
    const existing = combined.find(d => d.name === savedItem.name);
    if (existing) {
      Object.assign(existing, savedItem);
    } else {
      combined.push(savedItem);
    }
  });
  return combined;
}

function handlePurchase(e) {
  const productName = e.target.getAttribute("data-name");
  const productPrice = parseInt(e.target.getAttribute("data-price"));
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const productIndex = products.findIndex(p => p.name === productName);
  const product = products[productIndex];

  let quantity = 1;
  if (product.type === "in-stock") {
    // Ask how many items to buy
    const qtyInput = prompt(`Enter quantity to buy (Available: ${product.stock}):`, "1");
    quantity = Math.max(1, parseInt(qtyInput) || 1);
    if (quantity > product.stock) {
      alert("Not enough stock available.");
      return;
    }
    products[productIndex].stock -= quantity;
  } else {
    // Pre-order item (no stock reduction)
    const qtyInput = prompt("Enter quantity to pre-order:", "1");
    quantity = Math.max(1, parseInt(qtyInput) || 1);
  }

  localStorage.setItem("products", JSON.stringify(products));

  const buyer = prompt("Enter buyer's name:", "Anonymous") || "Anonymous";
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

  const newPurchase = {
    product: productName,
    buyer: buyer,
    type: product.type,
    amount: productPrice,
    quantity: quantity,
    total: productPrice * quantity,
    date: new Date().toISOString().split("T")[0]
  };

  purchases.push(newPurchase);
  localStorage.setItem("purchases", JSON.stringify(purchases));

  // Update UI
  if (product.type === "in-stock") {
    const stockText = document.getElementById(`stock-${productIndex}`);
    if (products[productIndex].stock > 0) {
      stockText.textContent = products[productIndex].stock;
    } else {
      stockText.textContent = "Out of Stock";
      stockText.classList.remove("text-success");
      stockText.classList.add("text-danger", "fw-bold");
      e.target.textContent = "Out of Stock";
      e.target.classList.remove("btn-outline-success");
      e.target.classList.add("btn-secondary");
      e.target.disabled = true;
    }
  }

  alert(`Purchase recorded!\n${quantity}x ${productName} bought by ${buyer}.`);
}

window.onload = loadProducts;
