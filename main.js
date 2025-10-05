// Default demo products (with stock + pre-order + emotional descriptions)
const defaultProducts = [
  {
    name: "Advent Circle",
    category: "Handycrafts",
    price: 200000,
    stock: 5,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JBF1XTZXP1D28KSBSXSP4TM4.jpg",
    description: "The Advent Circle is a handmade decoration that represents hope and renewal. Each piece is crafted by Siti Rahmah, a hearing-impaired mother of two from Yogyakarta who discovered her artistic talent after losing her ability to speak. She uses fallen twigs, rattan, and recycled ribbons to form each ring, pouring quiet emotion into every motion. For Siti, this work became her voice. Every circle takes hours to complete, guided only by touch and memory. She says that each loop is her way of wishing for peace in the world. Since joining Daoer Zenee’s artisan program, she has found both community and confidence. Hanging this decoration means carrying her spirit into your home, a reminder that strength can exist in silence and that beauty often comes from perseverance."
  },
  {
    name: "Bouquet",
    category: "Handycrafts",
    price: 200000,
    stock: 3,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JN30P3AVQEMB8CQDNTG7ZDRP.jpg",
    description: "This dried flower bouquet is made by Rani Putri, a young woman from Bandung who found healing through art after a life-changing accident left her in a wheelchair. Rani’s passion for creativity never faded. Instead of paint, she now works with petals, preserving flowers as symbols of rebirth and resilience. Each arrangement tells a story of patience and transformation, featuring blooms chosen for their meaning: lavender for calm, marigold for strength, and jasmine for hope. Rani works with other disabled women, training them to craft beauty from simple materials. She believes that flowers never truly die, they just find new ways to live. Her bouquets are not mass-produced; each one is slightly different, reflecting her belief that imperfection is part of life’s grace."
  },
  {
    name: "Tissue Box",
    category: "Handycrafts",
    price: 50000,
    stock: 8,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JN30A7X7P8GM65XJBWN1HPD4.jpg",
    description: "This bamboo tissue box is made by Budi Santoso, a craftsman from Bali who lost his sight as a child. Despite his blindness, Budi mastered the art of woodworking by using his hands as his eyes. Every edge, curve, and groove is felt, not seen. He uses sustainable bamboo, shaping each piece through intuition and rhythm. His workshop is filled with quiet focus, guided by the sound of tools and the warmth of the material. Budi learned from his late father and continues to teach other visually impaired artisans how to work independently. Each tissue box is unique, carrying the subtle marks of human touch. Buying this product supports not just his livelihood, but his mission to show that vision can live in the fingertips."
  },
  {
    name: "Flower Bouquet",
    category: "Handycrafts",
    price: 200000,
    stock: 2,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JBF3C2NBQMWM0VFVCHWZ44AC.jpg",
    description: "The preserved Flower Bouquet is created by Anita Kusuma, a single mother born with one fully formed arm. Anita transforms discarded petals and silk scraps into everlasting floral art. She began making these bouquets when traditional florists turned her away due to her physical difference. Her work redefines perfection, proving that art is not about symmetry but sincerity. Anita’s studio is a small space filled with color and hope. She designs her own adaptive tools to hold stems steady and trains other women with disabilities to do the same. Each bouquet she creates lasts for months, symbolizing endurance and care. When you hold her work, you hold the story of a woman who turned limitation into strength."
  },
  {
    name: "Christmas Ornaments",
    category: "Handycrafts",
    price: 50000,
    stock: 10,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JBF4BMX7WR907T8AGHJ7BREB.jpg",
    description: "These Christmas ornaments are crafted by two brothers, Eko and Wawan, who have Down syndrome and live near Surabaya. Their journey began as a small family activity with their mother, creating wooden stars to improve motor skills. Over time, their hobby turned into a joyful business. They use coconut shells, driftwood, and natural pigments to paint and decorate each piece. Eko shapes while Wawan paints, both working with laughter and pride. Every ornament is inspected by both brothers before it is approved. Their work radiates pure happiness and reminds us that creativity knows no barriers. Each ornament represents teamwork, love, and the belief that even simple hands can create extraordinary joy."
  },
  {
    name: "Custom Wooden Frame",
    category: "Handycrafts",
    price: 250000,
    type: "pre-order",
    preOrderLimit: Math.floor(Math.random() * 5) + 1,
    preOrdersMade: 0,
    img: "",
    description: "The Custom Wooden Frame is handcrafted by Rizal Hamdani, a deaf carpenter from Solo who has spent years perfecting his craft. He began woodworking as a boy, silently learning from his grandfather’s gestures. For Rizal, every piece of wood tells a story. He uses reclaimed teak, sanding and polishing it until it feels like skin. Each frame is custom-made with great attention to detail, meant to protect the photographs that carry our memories. Rizal signs his initials into the wood before delivery, a quiet promise of quality. His work is not just craftsmanship—it is a way to communicate without words. Through his frames, he teaches us that the strongest messages can be felt, not heard."
  }
];

// --- core logic ---
const defaultImg = "https://preyash2047.github.io/assets/img/no-preview-available.png?h=824917b166935ea4772542bec6e8f636";

function loadProducts() {
  const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const allProducts = mergeWithDefaults(defaultProducts, savedProducts);
  const container = document.getElementById("productList");
  container.innerHTML = "";

  allProducts.forEach((p, index) => {
    const imageSrc = p.img && p.img.trim() !== "" ? p.img : defaultImg;
    const outOfStock = p.type === "in-stock" && p.stock <= 0;
    const remainingPreOrders = (p.preOrderLimit || Math.floor(Math.random() * 5) + 1) - (p.preOrdersMade || 0);

    const card = document.createElement("div");
    card.className = "col-12 col-sm-6 col-md-4 col-lg-3";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${imageSrc}" class="card-img-top" alt="${p.name}" onerror="this.src='${defaultImg}'">
        <div class="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 class="card-title">${p.name}</h5>
            <p class="text-muted">${p.category}</p>
            <p class="fw-bold text-success">Rp. ${p.price.toLocaleString()}</p>
            ${
              p.type === "in-stock"
                ? `<p class="text-secondary small mb-2">Stock: 
                    <span id="stock-${index}" class="${outOfStock ? 'text-danger fw-bold' : 'text-success'}">
                      ${p.stock > 0 ? p.stock : 'Out of Stock'}
                    </span></p>`
                : `<p class="text-primary small mb-2 fw-bold">
                    Pre-order available: ${remainingPreOrders > 0 ? remainingPreOrders : 'Full'}
                  </p>`
            }
          </div>
          <div class="d-flex justify-content-between mt-2">
            <button class="btn btn-outline-primary view-btn flex-fill me-1" data-index="${index}">View Product</button>
            <button class="btn ${outOfStock ? 'btn-secondary' : 'btn-outline-success'} flex-fill ms-1 buy-btn" data-index="${index}" ${outOfStock ? 'disabled' : ''}>${outOfStock ? 'Out of Stock' : 'Buy'}</button>
          </div>
        </div>
      </div>`;
    container.appendChild(card);
  });

  localStorage.setItem("products", JSON.stringify(allProducts));
  document.querySelectorAll(".buy-btn").forEach(btn => btn.addEventListener("click", openPurchaseModal));
  document.querySelectorAll(".view-btn").forEach(btn => btn.addEventListener("click", openViewProductModal));
}

function mergeWithDefaults(defaults, saved) {
  const combined = [...defaults];
  saved.forEach(savedItem => {
    const existing = combined.find(d => d.name === savedItem.name);
    if (existing) Object.assign(existing, savedItem);
    else combined.push(savedItem);
  });
  return combined;
}

function openViewProductModal(e) {
  const index = e.target.getAttribute("data-index");
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const p = products[index];
  const modal = new bootstrap.Modal(document.getElementById("productViewModal"));
  document.getElementById("viewProductImage").src = p.img || defaultImg;
  document.getElementById("viewProductName").textContent = p.name;
  document.getElementById("viewProductCategory").textContent = p.category;
  document.getElementById("viewProductDescription").textContent = p.description || "No description available.";
  document.getElementById("viewProductPrice").textContent = `Rp. ${p.price.toLocaleString()}`;
  const modalBuyBtn = document.getElementById("modalBuyBtn");
  modalBuyBtn.onclick = () => {
    modal.hide();
    openPurchaseModal({ target: { getAttribute: () => index } });
  };
  modal.show();
}

function createPurchaseModal() {
  if (document.getElementById("purchaseModal")) return;
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
    </div>`;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

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
      ${
        p.type === "in-stock"
          ? `Stock available: ${p.stock}`
          : `Pre-order available: ${(p.preOrderLimit || 0) - (p.preOrdersMade || 0)}`
      }
    </p>`;
  const qtyInput = document.getElementById("purchaseQty");
  qtyInput.max = p.type === "in-stock" ? p.stock : (p.preOrderLimit || 5) - (p.preOrdersMade || 0);
  qtyInput.value = 1;
  const modal = new bootstrap.Modal(document.getElementById("purchaseModal"));
  modal.show();
  document.getElementById("confirmPurchaseBtn").onclick = function () {
    const buyerName = document.getElementById("buyerName").value.trim() || "Anonymous";
    let qty = parseInt(document.getElementById("purchaseQty").value) || 1;
    if (p.type === "in-stock" && qty > p.stock) {
      alert("Not enough stock available!");
      return;
    }
    if (p.type === "pre-order" && (p.preOrdersMade || 0) + qty > (p.preOrderLimit || 5)) {
      alert("Pre-order limit reached!");
      return;
    }
    handlePurchase(p, index, qty, buyerName);
    modal.hide();
  };
}

function handlePurchase(product, productIndex, quantity, buyer) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  if (product.type === "in-stock") products[productIndex].stock -= quantity;
  else if (product.type === "pre-order")
    products[productIndex].preOrdersMade = (products[productIndex].preOrdersMade || 0) + quantity;
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
  loadProducts();
  alert(`Purchase recorded!\n${quantity}x ${product.name} bought by ${buyer}.`);
}

window.onload = loadProducts;
