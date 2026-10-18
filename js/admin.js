/**
 * Ali Baba Sports - Admin Panel Controller
 * Handles KPI calculations, product CRUD, order status tracking,
 * and inventory management.
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let products = DB.getProducts();
  let orders = DB.getOrders();
  let currentEditingProductId = null;

  // DOM Elements - Sidebar & Views
  const menuItems = document.querySelectorAll(".menu-item");
  const viewSections = document.querySelectorAll(".view-section");
  const viewTitle = document.getElementById("viewTitle");
  const viewSubtitle = document.getElementById("viewSubtitle");
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const adminSidebar = document.getElementById("adminSidebar");

  // KPI Elements
  const kpiTotalRevenue = document.getElementById("kpiTotalRevenue");
  const kpiTotalOrders = document.getElementById("kpiTotalOrders");
  const kpiTotalProducts = document.getElementById("kpiTotalProducts");
  const kpiLowStock = document.getElementById("kpiLowStock");

  // Tables
  const recentOrdersTableBody = document.getElementById("recentOrdersTableBody");
  const productsTableBody = document.getElementById("productsTableBody");
  const allOrdersTableBody = document.getElementById("allOrdersTableBody");

  // Search & Filter
  const productSearchInput = document.getElementById("productSearchInput");
  const productCategoryFilter = document.getElementById("productCategoryFilter");
  const orderStatusFilter = document.getElementById("orderStatusFilter");

  // Modals
  const productModal = document.getElementById("productModal");
  const productModalTitle = document.getElementById("productModalTitle");
  const productForm = document.getElementById("productForm");
  const closeProductModalBtn = document.getElementById("closeProductModalBtn");
  const cancelProductBtn = document.getElementById("cancelProductBtn");
  const addProductTriggerBtn = document.getElementById("addProductTriggerBtn");

  const orderInvoiceModal = document.getElementById("orderInvoiceModal");
  const closeInvoiceModalBtn = document.getElementById("closeInvoiceModalBtn");
  const invoiceModalContent = document.getElementById("invoiceModalContent");

  // Settings Buttons
  const resetDemoDataBtn = document.getElementById("resetDemoDataBtn");

  // -------------------------------------------------------------
  // Initialization
  // -------------------------------------------------------------
  refreshAdminDashboard();

  // Navigation Tabs switching
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetView = item.getAttribute("data-view");
      if (!targetView) return;

      menuItems.forEach(m => m.classList.remove("active"));
      item.classList.add("active");

      viewSections.forEach(v => v.classList.remove("active"));
      const activeSection = document.getElementById(`view-${targetView}`);
      if (activeSection) activeSection.classList.add("active");

      // Update Topbar Headline
      if (targetView === "dashboard") {
        viewTitle.textContent = "Dashboard Overview";
        viewSubtitle.textContent = "Welcome to Ali Baba Sports cricket store management portal.";
      } else if (targetView === "products") {
        viewTitle.textContent = "Cricket Gear Inventory";
        viewSubtitle.textContent = "Add, edit, restock, or remove products from the catalog.";
      } else if (targetView === "orders") {
        viewTitle.textContent = "Orders & Dispatch Management";
        viewSubtitle.textContent = "Track shipments, customer details, and payment verification.";
      } else if (targetView === "settings") {
        viewTitle.textContent = "Store Configuration";
        viewSubtitle.textContent = "Manage store demo records and system settings.";
      }

      // Close mobile sidebar if open
      if (adminSidebar) adminSidebar.classList.remove("mobile-open");
    });
  });

  // Mobile sidebar toggle
  if (sidebarToggleBtn && adminSidebar) {
    sidebarToggleBtn.addEventListener("click", () => {
      adminSidebar.classList.toggle("mobile-open");
    });
  }

  // -------------------------------------------------------------
  // Dashboard Calculations & Tables
  // -------------------------------------------------------------
  function refreshAdminDashboard() {
    products = DB.getProducts();
    orders = DB.getOrders();

    // 1. Calculate KPIs
    const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    if (kpiTotalRevenue) kpiTotalRevenue.textContent = `Rs. ${totalRevenue.toLocaleString()}`;
    if (kpiTotalOrders) kpiTotalOrders.textContent = orders.length;
    if (kpiTotalProducts) kpiTotalProducts.textContent = products.length;
    if (kpiLowStock) kpiLowStock.textContent = lowStockCount;

    // 2. Render Recent Orders (Top 5 on Dashboard)
    renderRecentOrders();

    // 3. Render Product Management Table
    renderProductsTable();

    // 4. Render Orders Management Table
    renderAllOrdersTable();
  }

  function renderRecentOrders() {
    if (!recentOrdersTableBody) return;
    const recent = orders.slice(0, 5);

    if (recent.length === 0) {
      recentOrdersTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim);">No orders received yet.</td></tr>`;
      return;
    }

    recentOrdersTableBody.innerHTML = recent.map(order => `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>
          <div style="font-weight: 700;">${order.customer?.name || 'Customer'}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${order.customer?.city || 'Pakistan'}</div>
        </td>
        <td>${order.items?.length || 1} items</td>
        <td style="font-weight: 700; color: var(--admin-primary);">Rs. ${(order.totalAmount || 0).toLocaleString()}</td>
        <td>
          <span class="status-pill ${(order.status || 'Pending').toLowerCase()}">${order.status || 'Pending'}</span>
        </td>
        <td>
          <button class="btn-icon-sm" onclick="window.AliBabaAdmin.viewOrderInvoice('${order.id}')" title="View Order">
            <i class="fa-regular fa-eye"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  // -------------------------------------------------------------
  // Product Management (CRUD)
  // -------------------------------------------------------------
  function renderProductsTable() {
    if (!productsTableBody) return;

    let filtered = [...products];

    // Search filter
    const query = productSearchInput ? productSearchInput.value.toLowerCase().trim() : "";
    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
    }

    // Category filter
    const cat = productCategoryFilter ? productCategoryFilter.value : "all";
    if (cat !== "all") {
      filtered = filtered.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    if (filtered.length === 0) {
      productsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">No cricket products match your filter.</td></tr>`;
      return;
    }

    productsTableBody.innerHTML = filtered.map(p => `
      <tr>
        <td><strong>${p.id}</strong></td>
        <td>
          <div class="table-product-cell">
            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop&q=80'">
            <div class="prod-meta">
              <h5>${p.name}</h5>
              <span>${p.subCategory || p.category}</span>
            </div>
          </div>
        </td>
        <td><span style="text-transform: capitalize; color: #cbd5e1;">${p.category}</span></td>
        <td style="font-weight: 700; color: var(--admin-primary);">Rs. ${p.price.toLocaleString()}</td>
        <td>
          <span style="font-weight: 700; color: ${p.stock <= 3 ? 'var(--admin-red)' : p.stock <= 7 ? 'var(--admin-gold)' : 'var(--admin-primary)'}">
            ${p.stock} units
          </span>
        </td>
        <td><span class="status-pill ${p.stock > 0 ? 'delivered' : 'pending'}">${p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-sm" onclick="window.AliBabaAdmin.openEditProductModal('${p.id}')" title="Edit Product">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn-icon-sm delete" onclick="window.AliBabaAdmin.deleteProduct('${p.id}')" title="Delete Product">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  if (productSearchInput) productSearchInput.addEventListener("input", renderProductsTable);
  if (productCategoryFilter) productCategoryFilter.addEventListener("change", renderProductsTable);

  // Add / Edit Product Modal Controls
  function openAddProductModal() {
    currentEditingProductId = null;
    productForm.reset();
    productModalTitle.textContent = "Add New Cricket Gear";
    document.getElementById("prodIdHidden").value = "";
    productModal.classList.add("active");
  }

  function openEditProductModal(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    currentEditingProductId = id;
    productModalTitle.textContent = `Edit Product: ${prod.name}`;

    document.getElementById("prodIdHidden").value = prod.id;
    document.getElementById("prodNameInput").value = prod.name;
    document.getElementById("prodCategorySelect").value = prod.category;
    document.getElementById("prodSubCategoryInput").value = prod.subCategory || "";
    document.getElementById("prodPriceInput").value = prod.price;
    document.getElementById("prodOriginalPriceInput").value = prod.originalPrice || "";
    document.getElementById("prodStockInput").value = prod.stock;
    document.getElementById("prodWeightInput").value = prod.weight || "";
    document.getElementById("prodGrainsInput").value = prod.grains || "";
    document.getElementById("prodBadgeSelect").value = prod.badge || "Official";
    document.getElementById("prodImageInput").value = prod.image;
    document.getElementById("prodDescInput").value = prod.description || "";

    productModal.classList.add("active");
  }

  function closeProductModal() {
    productModal.classList.remove("active");
    currentEditingProductId = null;
  }

  if (addProductTriggerBtn) addProductTriggerBtn.addEventListener("click", openAddProductModal);
  if (closeProductModalBtn) closeProductModalBtn.addEventListener("click", closeProductModal);
  if (cancelProductBtn) cancelProductBtn.addEventListener("click", closeProductModal);

  // Form Submit (Save Product)
  if (productForm) {
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const prodData = {
        name: document.getElementById("prodNameInput").value.trim(),
        category: document.getElementById("prodCategorySelect").value,
        subCategory: document.getElementById("prodSubCategoryInput").value.trim(),
        price: Number(document.getElementById("prodPriceInput").value),
        originalPrice: Number(document.getElementById("prodOriginalPriceInput").value) || null,
        stock: Number(document.getElementById("prodStockInput").value),
        weight: document.getElementById("prodWeightInput").value.trim(),
        grains: document.getElementById("prodGrainsInput").value.trim(),
        badge: document.getElementById("prodBadgeSelect").value,
        image: document.getElementById("prodImageInput").value.trim() || "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop&q=80",
        description: document.getElementById("prodDescInput").value.trim(),
        rating: 4.9,
        reviewsCount: 15,
        inStock: Number(document.getElementById("prodStockInput").value) > 0
      };

      if (currentEditingProductId) {
        prodData.id = currentEditingProductId;
        DB.updateProduct(prodData);
        alert(`Product "${prodData.name}" has been updated successfully!`);
      } else {
        DB.addProduct(prodData);
        alert(`New product "${prodData.name}" added to inventory!`);
      }

      closeProductModal();
      refreshAdminDashboard();
    });
  }

  // -------------------------------------------------------------
  // Order Management
  // -------------------------------------------------------------
  function renderAllOrdersTable() {
    if (!allOrdersTableBody) return;

    let filtered = [...orders];
    const statusVal = orderStatusFilter ? orderStatusFilter.value : "all";

    if (statusVal !== "all") {
      filtered = filtered.filter(o => (o.status || "Pending").toLowerCase() === statusVal.toLowerCase());
    }

    if (filtered.length === 0) {
      allOrdersTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 30px;">No orders found.</td></tr>`;
      return;
    }

    allOrdersTableBody.innerHTML = filtered.map(order => `
      <tr>
        <td><strong>#${order.id}</strong></td>
        <td>
          <div style="font-weight: 700;">${order.customer?.name || 'Customer'}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${order.customer?.phone || ''}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${order.customer?.city || 'Pakistan'}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">${order.customer?.address || ''}</div>
        </td>
        <td>
          <span style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px;">
            ${order.paymentMethod || 'COD'}
          </span>
        </td>
        <td style="font-weight: 700; color: var(--admin-primary);">Rs. ${(order.totalAmount || 0).toLocaleString()}</td>
        <td>
          <select class="admin-filter-select" style="font-size: 0.8rem; padding: 4px 8px;" onchange="window.AliBabaAdmin.changeOrderStatus('${order.id}', this.value)">
            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
        <td>
          <button class="btn-icon-sm" onclick="window.AliBabaAdmin.viewOrderInvoice('${order.id}')" title="View Full Invoice">
            <i class="fa-solid fa-file-invoice"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  if (orderStatusFilter) orderStatusFilter.addEventListener("change", renderAllOrdersTable);

  // View Order Invoice Modal
  function viewOrderInvoice(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order || !invoiceModalContent) return;

    invoiceModalContent.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--admin-border);">
        <div>
          <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: var(--admin-primary);">ALI BABA SPORTS</h2>
          <p style="font-size: 0.8rem; color: var(--text-dim);">Sialkot Sports Hub, Punjab, Pakistan</p>
          <p style="font-size: 0.8rem; color: var(--text-dim);">UAN: +92 52 111-CRICKET (2742538)</p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.2rem; font-weight: 800;">ORDER INVOICE</div>
          <div style="font-weight: 700; color: var(--admin-primary);">#${order.id}</div>
          <div style="font-size: 0.78rem; color: var(--text-dim);">${order.date || 'Today'}</div>
          <span class="status-pill ${(order.status || 'Pending').toLowerCase()}" style="margin-top: 6px;">${order.status || 'Pending'}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; background: #090d16; padding: 16px; border-radius: 8px;">
        <div>
          <h4 style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 6px;">Customer Details</h4>
          <p style="font-weight: 700; font-size: 0.95rem;">${order.customer?.name}</p>
          <p style="font-size: 0.85rem; color: var(--text-sub);">${order.customer?.phone}</p>
          <p style="font-size: 0.85rem; color: var(--text-sub);">${order.customer?.email || 'N/A'}</p>
        </div>
        <div>
          <h4 style="font-size: 0.85rem; color: var(--text-dim); text-transform: uppercase; margin-bottom: 6px;">Delivery Destination</h4>
          <p style="font-size: 0.85rem; color: var(--text-sub);">${order.customer?.address}</p>
          <p style="font-weight: 700; font-size: 0.85rem; color: var(--admin-gold);">${order.customer?.city}, Pakistan</p>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">Payment: <strong>${order.paymentMethod}</strong></p>
        </div>
      </div>

      <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px;">Ordered Cricket Equipment</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--admin-border); text-align: left; font-size: 0.75rem; color: var(--text-dim);">
            <th style="padding: 8px;">ITEM DESCRIPTION</th>
            <th style="padding: 8px; text-align: center;">QTY</th>
            <th style="padding: 8px; text-align: right;">PRICE</th>
            <th style="padding: 8px; text-align: right;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${(order.items || []).map(item => `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
              <td style="padding: 10px 8px;">
                <strong>${item.name}</strong>
                <div style="font-size: 0.72rem; color: var(--text-dim);">${item.weight || 'Standard'} • ${item.handle || 'Standard'}</div>
              </td>
              <td style="padding: 10px 8px; text-align: center;">${item.quantity || 1}</td>
              <td style="padding: 10px 8px; text-align: right;">Rs. ${(item.price || 0).toLocaleString()}</td>
              <td style="padding: 10px 8px; text-align: right; font-weight: 700;">Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="display: flex; justify-content: flex-end; padding-top: 10px; border-top: 1px solid var(--admin-border);">
        <div style="width: 250px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
            <span style="color: var(--text-dim);">Grand Total:</span>
            <span style="font-size: 1.25rem; font-weight: 800; color: var(--admin-primary);">Rs. ${(order.totalAmount || 0).toLocaleString()}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-dim); text-align: right;">Inclusive of all GST & Shipping</div>
        </div>
      </div>
    `;

    orderInvoiceModal.classList.add("active");
  }

  if (closeInvoiceModalBtn) {
    closeInvoiceModalBtn.addEventListener("click", () => {
      orderInvoiceModal.classList.remove("active");
    });
  }

  // Settings & Reset
  if (resetDemoDataBtn) {
    resetDemoDataBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to restore default cricket equipment catalog & orders?")) {
        DB.resetDefaultProducts();
        localStorage.removeItem("ali_baba_orders");
        DB.getOrders(); // reseeds default
        refreshAdminDashboard();
        alert("Storefront and Admin database successfully reset to default factory state!");
      }
    });
  }

  // Global window functions for table click handles
  window.AliBabaAdmin = {
    openEditProductModal(id) {
      openEditProductModal(id);
    },
    deleteProduct(id) {
      if (confirm("Are you sure you want to remove this item from your cricket store?")) {
        DB.deleteProduct(id);
        refreshAdminDashboard();
      }
    },
    changeOrderStatus(id, newStatus) {
      DB.updateOrderStatus(id, newStatus);
      refreshAdminDashboard();
    },
    viewOrderInvoice(id) {
      viewOrderInvoice(id);
    }
  };
});
