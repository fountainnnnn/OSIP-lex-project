window.addEventListener("DOMContentLoaded", () => {
  initializeMockData();
  loadDashboard();
  renderPurchases();
  setupStockInputToggle(); // ✅ re-added for quantity toggle behavior
});

//  Initialize mock data for testing/demo
function initializeMockData() {
  const existingPurchases = JSON.parse(localStorage.getItem("purchases"));
  if (!existingPurchases || existingPurchases.length === 0) {
    const mockPurchases = [
      { product: "Batik Tote Bag", buyer: "Alya", type: "in-stock", quantity: 1, total: 85000, date: "2025-09-29" },
      { product: "Handcrafted Soap", buyer: "Rafi", type: "in-stock", quantity: 3, total: 135000, date: "2025-09-30" },
      { product: "Bamboo Lamp", buyer: "Nadia", type: "in-stock", quantity: 1, total: 220000, date: "2025-10-01" },
      { product: "Christmas Ornament Set", buyer: "Lukas", type: "pre-order", quantity: 2, total: 100000, date: "2025-10-02" },
      { product: "Custom Wooden Frame", buyer: "Elena", type: "pre-order", quantity: 1, total: 250000, date: "2025-10-03" },
      { product: "Woven Basket", buyer: "Hani", type: "in-stock", quantity: 2, total: 160000, date: "2025-10-04" }
    ];
    localStorage.setItem("purchases", JSON.stringify(mockPurchases));
  }

  const existingProducts = JSON.parse(localStorage.getItem("products"));
  if (!existingProducts || existingProducts.length === 0) {
    const mockProducts = [
      { name: "Batik Tote Bag", category: "Handycrafts", price: 85000, stock: 4, type: "in-stock", description: "Handmade batik tote bag with traditional patterns." },
      { name: "Handcrafted Soap", category: "Handycrafts", price: 45000, stock: 6, type: "in-stock", description: "Organic soap with floral scent and eco-friendly packaging." },
      { name: "Bamboo Lamp", category: "Home Decor", price: 220000, stock: 3, type: "in-stock", description: "Eco-friendly handcrafted bamboo lamp perfect for warm interiors." },
      { name: "Christmas Ornament Set", category: "Decor", price: 50000, type: "pre-order", preOrderLimit: 5, preOrdersMade: 1, description: "Festive ornament set with traditional Indonesian touches." },
      { name: "Custom Wooden Frame", category: "Handycrafts", price: 250000, type: "pre-order", preOrderLimit: 5, preOrdersMade: 0, description: "Beautifully engraved customizable wooden photo frame." },
      { name: "Woven Basket", category: "Handycrafts", price: 80000, stock: 5, type: "in-stock", description: "Sturdy woven basket made from recycled materials." }
    ];
    localStorage.setItem("products", JSON.stringify(mockProducts));
  }
}

//  Dashboard calculation
function loadDashboard() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalPurchases").textContent = purchases.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const revenue = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  document.getElementById("totalRevenue").textContent = revenue.toLocaleString("id-ID");

  const totalStock = products
    .filter(p => p.type === "in-stock")
    .reduce((sum, p) => sum + (p.stock || 0), 0);
  document.getElementById("totalStock").textContent = totalStock;
}

//  Render purchase history table
function renderPurchases() {
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  const table = document.getElementById("purchaseHistory");
  table.innerHTML = "";

  if (purchases.length === 0) {
    table.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No purchases recorded.</td></tr>`;
    return;
  }

  purchases.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.product}</td>
      <td>${p.buyer || "N/A"}</td>
      <td>${p.type || "in-stock"}</td>
      <td>${p.quantity || 1}</td>
      <td>Rp. ${(p.total || 0).toLocaleString("id-ID")}</td>
      <td>${p.date || new Date().toISOString().split("T")[0]}</td>
    `;
    table.appendChild(row);
  });
}

//  Record a new purchase (for checkout integration)
function recordPurchase(purchaseData) {
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  purchases.push(purchaseData);
  localStorage.setItem("purchases", JSON.stringify(purchases));

  // update product stock or pre-order counter
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

  loadDashboard();
  renderPurchases();
}

//  Add Product handler
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const price = parseInt(document.getElementById("price").value);
  const type = document.getElementById("type").value;
  const stockInput = document.getElementById("stock");
  const quantityValue = parseInt(stockInput.value) || 0;
  const descText = document.getElementById("description").value.trim();
  const fileInput = document.getElementById("imgFile");

  let imgBase64 = "";
  if (fileInput.files.length > 0) {
    imgBase64 = await toBase64(fileInput.files[0]);
  }

  const defaultImg = "https://preyash2047.github.io/assets/img/no-preview-available.png?h=824917b166935ea4772542bec6e8f636";

  const newProduct = {
    name,
    category,
    price,
    img: imgBase64 || defaultImg,
    description: descText,
    type,
    ...(type === "in-stock" && { stock: quantityValue }),
    ...(type === "pre-order" && { preOrderLimit: quantityValue, preOrdersMade: 0 })
  };

  const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  savedProducts.push(newProduct);
  localStorage.setItem("products", JSON.stringify(savedProducts));

  alert("Product added successfully!");
  document.getElementById("productForm").reset();
  loadDashboard();
});

// ✅ Re-added: stock / pre-order quantity dynamic toggle
function setupStockInputToggle() {
  const typeSelect = document.getElementById("type");
  const stockInput = document.getElementById("stock");
  const stockLabel = document.getElementById("stockLabel");

  typeSelect.addEventListener("change", () => {
    if (typeSelect.value === "in-stock") {
      stockInput.disabled = false;
      stockInput.placeholder = "Stock Quantity";
      stockLabel.textContent = "Enter available stock";
      stockInput.required = true;
    } else if (typeSelect.value === "pre-order") {
      stockInput.disabled = false;
      stockInput.placeholder = "Pre-order Limit";
      stockLabel.textContent = "Enter max pre-order quantity";
      stockInput.required = true;
    } else {
      stockInput.disabled = true;
      stockInput.placeholder = "Quantity";
      stockLabel.textContent = "";
      stockInput.required = false;
      stockInput.value = "";
    }
  });
}

//  Helper: convert file to Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
