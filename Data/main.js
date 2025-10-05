document.addEventListener("DOMContentLoaded", () => {
  initializeMockData();
  loadDashboardInsights();
});

let salesTrendChartInstance = null;

// Initialize mock data
function initializeMockData() {
  const existingPurchases = JSON.parse(localStorage.getItem("purchases"));
  if (!existingPurchases || existingPurchases.length === 0) {
    const mockPurchases = [
      { product: "Batik Tote Bag", buyer: "Alya", type: "in-stock", quantity: 1, total: 85000, date: "2025-09-29" },
      { product: "Handcrafted Soap", buyer: "Rafi", type: "in-stock", quantity: 3, total: 135000, date: "2025-09-30" },
      { product: "Christmas Ornament Set", buyer: "Nadia", type: "pre-order", quantity: 2, total: 100000, date: "2025-10-01" },
      { product: "Bamboo Lamp", buyer: "Lukas", type: "in-stock", quantity: 1, total: 220000, date: "2025-10-02" },
      { product: "Woven Basket", buyer: "Elena", type: "pre-order", quantity: 2, total: 160000, date: "2025-10-03" },
      { product: "Advent Circle", buyer: "Siti", type: "in-stock", quantity: 1, total: 200000, date: "2025-10-04" }
    ];
    localStorage.setItem("purchases", JSON.stringify(mockPurchases));
  }

  const existingProducts = JSON.parse(localStorage.getItem("products"));
  if (!existingProducts || existingProducts.length === 0) {
    const mockProducts = [
      { name: "Batik Tote Bag", category: "Handycrafts", price: 85000, stock: 4, type: "in-stock" },
      { name: "Handcrafted Soap", category: "Handycrafts", price: 45000, stock: 6, type: "in-stock" },
      { name: "Christmas Ornament Set", category: "Decor", price: 50000, type: "pre-order", preOrderLimit: 5 },
      { name: "Bamboo Lamp", category: "Home Decor", price: 220000, stock: 3, type: "in-stock" },
      { name: "Woven Basket", category: "Handycrafts", price: 80000, type: "pre-order", preOrderLimit: 3 },
      { name: "Advent Circle", category: "Handycrafts", price: 200000, stock: 2, type: "in-stock" }
    ];
    localStorage.setItem("products", JSON.stringify(mockProducts));
  }
}

// Load dashboard
function loadDashboardInsights() {
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];

  const totalSales = purchases.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const totalRevenue = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const avgQty = totalSales ? (totalSales / purchases.length).toFixed(2) : 0;

  const productSales = {};
  purchases.forEach(p => {
    productSales[p.product] = (productSales[p.product] || 0) + (p.quantity || 1);
  });
  const topProduct = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  document.getElementById("totalSales").textContent = totalSales;
  document.getElementById("totalRevenue").textContent = totalRevenue.toLocaleString("id-ID");
  document.getElementById("topProduct").textContent = topProduct;
  document.getElementById("avgQty").textContent = avgQty;

  drawRevenueChart(purchases);
  drawTypeDistribution(products);
  drawSalesTrend(purchases);
  renderRecentPurchases(purchases);
}

// Bar Chart: Revenue by Product
function drawRevenueChart(purchases) {
  const dataMap = {};
  purchases.forEach(p => {
    dataMap[p.product] = (dataMap[p.product] || 0) + (p.total || 0);
  });

  new Chart(document.getElementById("revenueChart"), {
    type: "bar",
    data: {
      labels: Object.keys(dataMap),
      datasets: [{
        label: "Revenue (Rp)",
        data: Object.values(dataMap),
        backgroundColor: "#198754",
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => "Rp " + v.toLocaleString("id-ID"), color: "#333" },
          grid: { color: "rgba(0,0,0,0.05)" }
        },
        x: { ticks: { color: "#333" }, grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// Pie Chart: Stock vs Pre-Order
function drawTypeDistribution(products) {
  const inStock = products.filter(p => p.type === "in-stock").length;
  const preOrder = products.filter(p => p.type === "pre-order").length;

  new Chart(document.getElementById("typeDistributionChart"), {
    type: "pie",
    data: {
      labels: ["In Stock", "Pre-Order"],
      datasets: [{
        data: [inStock, preOrder],
        backgroundColor: ["#198754", "#FFC107"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } }
    }
  });
}

// Line Chart: Daily Sales Trend
function drawSalesTrend(purchases) {
  const trendData = {};
  purchases.forEach(p => {
    trendData[p.date] = (trendData[p.date] || 0) + (p.total || 0);
  });

  const labels = Object.keys(trendData).sort();
  const values = labels.map(date => trendData[date]);

  if (salesTrendChartInstance) salesTrendChartInstance.destroy();

  const ctx = document.getElementById("salesTrendChart");
  salesTrendChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Revenue (Rp)",
        data: values,
        fill: true,
        borderColor: "#198754",
        backgroundColor: "rgba(25,135,84,0.1)",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#198754"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: v => "Rp " + v.toLocaleString("id-ID"), color: "#333" },
          grid: { color: "rgba(0,0,0,0.05)" }
        },
        x: { ticks: { color: "#333" }, grid: { color: "rgba(0,0,0,0.05)" } }
      },
      interaction: { mode: "index", intersect: false }
    }
  });
}

// Recent Purchases Table
function renderRecentPurchases(purchases) {
  const table = document.getElementById("recentTable");
  table.innerHTML = "";

  if (purchases.length === 0) {
    table.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No purchases found.</td></tr>`;
    return;
  }

  purchases.slice(-10).reverse().forEach((p, i) => {
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
