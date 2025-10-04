window.addEventListener("DOMContentLoaded", () => {
  initializeMockData();
  loadDashboard();
  renderPurchases();
});

// ✅ Ensure mock data loads only if no existing real data
function initializeMockData() {
  const existingPurchases = JSON.parse(localStorage.getItem("purchases"));
  if (!existingPurchases || existingPurchases.length === 0) {
    const mockPurchases = [
      { product: "Batik Tote Bag", buyer: "Alya", type: "in-stock", quantity: 1, total: 85000, date: "2025-09-29" },
      { product: "Handcrafted Soap", buyer: "Rafi", type: "in-stock", quantity: 3, total: 135000, date: "2025-09-30" },
      { product: "Christmas Ornament Set", buyer: "Nadia", type: "pre-order", quantity: 2, total: 100000, date: "2025-10-01" },
      { product: "Bamboo Lamp", buyer: "Lukas", type: "in-stock", quantity: 1, total: 220000, date: "2025-10-02" },
      { product: "Woven Basket", buyer: "Elena", type: "pre-order", quantity: 2, total: 160000, date: "2025-10-03" }
    ];
    localStorage.setItem("purchases", JSON.stringify(mockPurchases));
  }

  const existingProducts = JSON.parse(localStorage.getItem("products"));
  if (!existingProducts || existingProducts.length === 0) {
    const mockProducts = [
      { name: "Batik Tote Bag", category: "Handycrafts", price: 85000, stock: 4, type: "in-stock" },
      { name: "Handcrafted Soap", category: "Handycrafts", price: 45000, stock: 6, type: "in-stock" },
      { name: "Christmas Ornament Set", category: "Decor", price: 50000, type: "pre-order" },
      { name: "Bamboo Lamp", category: "Home Decor", price: 220000, stock: 3, type: "in-stock" },
      { name: "Woven Basket", category: "Handycrafts", price: 80000, type: "pre-order" }
    ];
    localStorage.setItem("products", JSON.stringify(mockProducts));
  }
}

function loadDashboard() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

  // Count total products and purchases
  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalPurchases").textContent = purchases.reduce((sum, p) => sum + (p.quantity || 1), 0);

  // Calculate total revenue correctly
  const revenue = purchases.reduce((sum, p) => sum + (p.total || (p.quantity * p.amount) || 0), 0);
  document.getElementById("totalRevenue").textContent = revenue.toLocaleString("id-ID");

  // Total stock (only for in-stock products)
  const totalStock = products
    .filter(p => p.type === "in-stock")
    .reduce((sum, p) => sum + (p.stock || 0), 0);
  const stockElement = document.getElementById("totalStock");
  if (stockElement) stockElement.textContent = totalStock;
}

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
      <td>${p.buyer}</td>
      <td>${p.type ? p.type.replace("-", " ") : "Unknown"}</td>
      <td>${p.quantity || 1}</td>
      <td>Rp. ${(p.total || 0).toLocaleString("id-ID")}</td>
      <td>${p.date}</td>
    `;
    table.appendChild(row);
  });
}

// Handle Add Product form
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const price = parseInt(document.getElementById("price").value);
  const type = document.getElementById("type").value;
  const stock = parseInt(document.getElementById("stock").value) || 0;
  const fileInput = document.getElementById("imgFile");

  // Convert uploaded image to base64
  let imgBase64 = "";
  if (fileInput.files.length > 0) {
    imgBase64 = await toBase64(fileInput.files[0]);
  }

  // Default placeholder if no image uploaded
  const defaultImg = "https://preyash2047.github.io/assets/img/no-preview-available.png?h=824917b166935ea4772542bec6e8f636";

  const newProduct = {
    name,
    category,
    price,
    img: imgBase64 || defaultImg,
    type,
    ...(type === "in-stock" && { stock })
  };

  const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
  savedProducts.push(newProduct);
  localStorage.setItem("products", JSON.stringify(savedProducts));

  alert("Product added successfully!");
  document.getElementById("productForm").reset();
  loadDashboard();
});

// Convert file to Base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
