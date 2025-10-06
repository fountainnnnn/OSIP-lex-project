window.addEventListener("DOMContentLoaded", () => {
  initializeMockData();
  loadDashboard();
  renderPurchases();
});

// ✅ Initialize mock data
function initializeMockData() {
  const existingPurchases = JSON.parse(localStorage.getItem("purchases"));
  if (!existingPurchases || existingPurchases.length === 0) {
    const mockPurchases = [
      { product: "Batik Tote Bag", buyer: "Alya", type: "in-stock", quantity: 1, total: 85000, date: "2025-09-29" },
      { product: "Handcrafted Soap", buyer: "Rafi", type: "in-stock", quantity: 3, total: 135000, date: "2025-09-30" }
    ];
    localStorage.setItem("purchases", JSON.stringify(mockPurchases));
  }

  const existingProducts = JSON.parse(localStorage.getItem("products"));
  if (!existingProducts || existingProducts.length === 0) {
    const mockProducts = [
      { name: "Batik Tote Bag", category: "Handycrafts", price: 85000, stock: 4, type: "in-stock", description: "Handmade batik tote bag with traditional patterns." },
      { name: "Bamboo Lamp", category: "Home Decor", price: 220000, stock: 3, type: "in-stock", description: "Eco-friendly handcrafted bamboo lamp." }
    ];
    localStorage.setItem("products", JSON.stringify(mockProducts));
  }
}

function loadDashboard() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalPurchases").textContent = purchases.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const revenue = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  document.getElementById("totalRevenue").textContent = revenue.toLocaleString("id-ID");
  const totalStock = products.filter(p => p.type === "in-stock").reduce((sum, p) => sum + (p.stock || 0), 0);
  document.getElementById("totalStock").textContent = totalStock;
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
      <td>${p.type}</td>
      <td>${p.quantity}</td>
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
  const stockInput = document.getElementById("stock");
  const quantityValue = parseInt(stockInput.value) || 0;
  const descText = document.getElementById("description").value.trim();
  const fileInput = document.getElementById("imgFile");

  // Convert uploaded image to base64 if provided
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

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}
