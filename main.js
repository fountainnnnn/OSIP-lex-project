const defaultImg = "https://preyash2047.github.io/assets/img/no-preview-available.png?h=824917b166935ea4772542bec6e8f636";

// Default demo products
const defaultProducts = [
  {
    name: "Advent Circle",
    category: "Handycrafts",
    price: 200000,
    stock: 5,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JBF1XTZXP1D28KSBSXSP4TM4.jpg",
    description: "The Advent Circle began as a small festive idea among a group of village artisans in Yogyakarta who wanted to bring the warmth of Christmas to local homes. Each circle is carefully woven from reclaimed rattan and decorated with natural fibers, dried flowers, and subtle touches of gold paint. The workers, mostly mothers and young adults, collaborate in a communal workspace where they share stories and laughter while hand-tying each strand. Their process is slow, intentional, and full of care — every loop and knot carries the rhythm of tradition passed down through generations. Buying an Advent Circle isn’t just purchasing a decoration; it’s supporting a micro-community that sustains itself through craft. Many artisans use their earnings to fund children’s education or help their families during the festive season. When displayed, the Advent Circle becomes a reminder that beauty can be born from simple, humble materials — and that joy multiplies when shared."
  },
  {
    name: "Bouquet",
    category: "Handycrafts",
    price: 200000,
    stock: 3,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JN30P3AVQEMB8CQDNTG7ZDRP.jpg",
    description: "The Bouquet is made in Bandung by a small cooperative of women who started crafting artificial flowers during the pandemic to sustain their families. Using recycled paper, fabric offcuts, and locally sourced bamboo stems, each bouquet tells a story of resilience and rebirth. The artisans spend hours curling petals, hand-dyeing shades, and assembling harmonious color blends inspired by Indonesian flora. No two bouquets are ever alike — imperfections are embraced as signs of authenticity. Behind every petal is a worker’s touch, guided by memories of real gardens from their childhoods. The collective reinvests profits into better workspaces and skill workshops for young crafters. Customers often remark that these bouquets feel alive — not because they mimic real flowers perfectly, but because they carry human warmth. Owning a Bouquet means carrying a piece of Indonesia’s creative spirit and a symbol of how artistry can bloom even in challenging times."
  },
  {
    name: "Tissue Box",
    category: "Handycrafts",
    price: 50000,
    stock: 8,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JN30A7X7P8GM65XJBWN1HPD4.jpg",
    description: "The Tissue Box was born from the ingenuity of woodworkers in Jepara, a town famed for its furniture craftsmanship. After the global slowdown, many factories closed — but a handful of artisans continued working with leftover teak and mahogany scraps. They began shaping simple, elegant household pieces that merged function with story. Each tissue box is polished by hand, retaining the wood’s natural grain patterns, symbolizing both endurance and beauty in imperfection. The artisans say the scent of freshly cut wood reminds them of their fathers’ workshops — a connection to legacy that keeps their traditions alive. Every purchase helps sustain these independent craftsmen, many of whom train apprentices to preserve Jepara’s woodworking heritage. The result is a product that feels personal, warm, and timeless — a small, everyday item infused with decades of skill and pride."
  },
  {
    name: "Flower Bouquet",
    category: "Handycrafts",
    price: 200000,
    stock: 2,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JBF3C2NBQMWM0VFVCHWZ44AC.jpg",
    description: "The Flower Bouquet comes from the heart of Bali, crafted by a team of young artisans who merge traditional weaving with modern floral design. Using eco-friendly materials such as dried palm leaves and repurposed fabrics, the group focuses on sustainability while celebrating local artistry. Every bouquet reflects hours of patient craftsmanship — layering textures, blending colors, and binding each piece with love. The workshop operates as a small social enterprise, offering flexible work hours to mothers balancing childcare and creative work. Many of them describe their craft as therapeutic, helping them rebuild after economic hardship. By purchasing a Flower Bouquet, you’re directly supporting this empowerment model — where artistry meets livelihood. Each piece carries a distinct story, making it not just a decorative item but a statement of purpose, resilience, and hope."
  },
  {
    name: "Christmas Ornaments",
    category: "Handycrafts",
    price: 50000,
    stock: 10,
    type: "in-stock",
    img: "https://daoerzenee.com/storage/products/01JBF4BMX7WR907T8AGHJ7BREB.jpg",
    description: "Each set of Christmas Ornaments is handmade in a small village workshop in Central Java, where generations of families have passed down the art of clay and wood carving. During the holiday season, the entire community gathers to craft tiny angels, stars, and wreaths painted with natural pigments derived from local plants. The production process doubles as a festive gathering — laughter, songs, and stories fill the workspace. Many artisans see this as a way to keep cultural heritage alive for their children. These ornaments are more than décor; they embody shared joy, collaboration, and the warmth of Indonesian craftsmanship. Every purchase helps sustain the artisans during the off-season, ensuring their traditions continue for years to come. Display them in your home, and you’ll not only add color to your celebrations but carry the essence of human connection across continents."
  },
  {
    name: "Custom Wooden Frame",
    category: "Handycrafts",
    price: 250000,
    type: "pre-order",
    preOrderLimit: 5,
    preOrdersMade: 0,
    img: "",
    description: "The Custom Wooden Frame is a personalized creation handcrafted in Solo by master woodcarvers who blend precision with artistry. Each frame begins as sustainably sourced teak, selected for its durability and natural beauty. Customers can request custom engravings — names, dates, or messages — that are carved by hand using traditional chisels. The artisans behind each frame work from family-run studios that have been active for over three decades. They view every commission as a personal dialogue between maker and buyer, ensuring that each product reflects the story of the person it’s made for. Many of these craftsmen teach younger apprentices, passing down both skills and values of patience, integrity, and dedication. When you pre-order a Custom Wooden Frame, you’re not only acquiring an heirloom piece but also supporting a legacy of Indonesian woodworking that thrives on meaning, not mass production."
  }
];

// Load products
function loadProducts() {
  const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const allProducts = mergeWithDefaults(defaultProducts, savedProducts);
  const container = document.getElementById("productList");
  container.innerHTML = "";

  allProducts.forEach((p, index) => {
    const imageSrc = p.img && p.img.trim() !== "" ? p.img : defaultImg;
    const outOfStock = p.type === "in-stock" && p.stock <= 0;
    const remainingPreOrders = (p.preOrderLimit || 5) - (p.preOrdersMade || 0);

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
            ${p.type === "in-stock"
              ? `<p class="small text-secondary mb-2">Stock: ${p.stock}</p>`
              : `<p class="small text-primary mb-2 fw-bold">Pre-order available: ${remainingPreOrders}</p>`}
          </div>
          <div class="d-flex justify-content-between mt-2">
            <button class="btn btn-outline-primary view-btn flex-fill me-1" data-index="${index}">View Product</button>
            <button class="btn ${outOfStock ? 'btn-secondary' : 'btn-outline-success'} flex-fill ms-1 buy-btn"
                    data-index="${index}" ${outOfStock ? 'disabled' : ''}>${outOfStock ? 'Out of Stock' : 'Buy'}</button>
          </div>
        </div>
      </div>`;
    container.appendChild(card);
  });

  localStorage.setItem("products", JSON.stringify(allProducts));
  document.querySelectorAll(".buy-btn").forEach(btn => btn.addEventListener("click", openPurchaseModal));
  document.querySelectorAll(".view-btn").forEach(btn => btn.addEventListener("click", openViewProductModal));
  updateCartUI();
}

// Merge product lists
function mergeWithDefaults(defaults, saved) {
  const combined = [...defaults];
  saved.forEach(savedItem => {
    const existing = combined.find(d => d.name === savedItem.name);
    if (existing) Object.assign(existing, savedItem);
    else combined.push(savedItem);
  });
  return combined;
}

// Purchase modal
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
            <div class="mb-3">
              <label class="form-label">Quantity</label>
              <input type="number" class="form-control" id="purchaseQty" min="1" value="1" required>
            </div>
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
    <p class="mb-1 fw-bold text-success">Rp. ${p.price.toLocaleString()}</p>`;
  const qtyInput = document.getElementById("purchaseQty");
  qtyInput.max = p.type === "in-stock" ? p.stock : (p.preOrderLimit || 5) - (p.preOrdersMade || 0);
  const modal = new bootstrap.Modal(document.getElementById("purchaseModal"));
  modal.show();
  document.getElementById("confirmPurchaseBtn").onclick = function () {
    let qty = parseInt(document.getElementById("purchaseQty").value) || 1;
    if (p.type === "in-stock" && qty > p.stock) return showSuccess("Not enough stock!");
    handlePurchase(p, index, qty);
    modal.hide();
  };
}

function handlePurchase(product, productIndex, quantity) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  if (product.type === "in-stock") products[productIndex].stock -= quantity;
  else if (product.type === "pre-order")
    products[productIndex].preOrdersMade = (products[productIndex].preOrdersMade || 0) + quantity;
  localStorage.setItem("products", JSON.stringify(products));
  addToCart({ name: product.name, price: product.price, img: product.img || defaultImg, qty: quantity });
  loadProducts();
  showSuccess(`Added ${quantity}x ${product.name} to cart`);
}

// Cart system
function getCart() { return JSON.parse(localStorage.getItem("cart")) || []; }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name);
  if (existing) existing.qty += product.qty || 1;
  else cart.push(product);
  saveCart(cart);
  updateCartUI();
}

function updateCartUI() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = count;
  const preview = document.getElementById("cartPreview");
  if (cart.length === 0) return preview.innerHTML = `<li class="text-center text-muted">Cart is empty</li>`;
  preview.innerHTML = "";
  cart.slice(0, 3).forEach(item => {
    preview.innerHTML += `
      <li class="d-flex align-items-center mb-2">
        <img src="${item.img}" alt="${item.name}" width="40" height="40" class="rounded me-2" style="object-fit:cover;">
        <div class="flex-fill">
          <div class="fw-semibold">${item.name}</div>
          <small class="text-muted">x${item.qty} — Rp. ${(item.price * item.qty).toLocaleString()}</small>
        </div>
      </li>`;
  });
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  preview.innerHTML += `
    <li><hr></li>
    <li class="text-end fw-bold mb-2">Total: Rp. ${total.toLocaleString()}</li>
    <li><button class="btn btn-success w-100" onclick="goToCheckout()">Go to Checkout</button></li>`;
}

function goToCheckout() { window.location.href = "Payment/index.html"; }

// Product view modal
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
  document.getElementById("modalBuyBtn").onclick = () => { openPurchaseModal({ target: { getAttribute: () => index } }); modal.hide(); };
  modal.show();
}

// Temporary success popup
function showSuccess(message) {
  const modal = document.getElementById("successModal");
  document.getElementById("successMessage").textContent = message;
  modal.classList.add("show");
  setTimeout(() => modal.classList.remove("show"), 2000);
}

window.onload = () => {
  loadProducts();
  updateCartUI();
};
