/**
 * Ali Baba Sports - Storefront Controller
 * Handles catalog rendering, category filtering, search, cart, wishlist,
 * bat customizer, checkout flow, and live notifications.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    products: DB.getProducts(),
    selectedCategory: "all",
    searchQuery: "",
    sortBy: "featured",
    currentCurrency: "PKR",
    activeCoupon: null,
    discountAmount: 0
  };

  // DOM Elements
  const productsGrid = document.getElementById("productsGrid");
  const categoryTabs = document.querySelectorAll(".category-btn");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const currencySelect = document.getElementById("currencySelect");

  // Cart & Wishlist Triggers
  const cartTriggerBtn = document.getElementById("cartTriggerBtn");
  const wishlistTriggerBtn = document.getElementById("wishlistTriggerBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const wishlistDrawer = document.getElementById("wishlistDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const closeWishlistBtn = document.getElementById("closeWishlistBtn");

  // Badges
  const cartCountBadge = document.getElementById("cartCountBadge");
  const wishlistCountBadge = document.getElementById("wishlistCountBadge");

  // Drawers content
  const cartItemsList = document.getElementById("cartItemsList");
  const wishlistItemsList = document.getElementById("wishlistItemsList");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartDiscountEl = document.getElementById("cartDiscount");
  const cartShippingEl = document.getElementById("cartShipping");
  const cartTotalEl = document.getElementById("cartTotal");

  // Coupon
  const couponInput = document.getElementById("couponInput");
  const applyCouponBtn = document.getElementById("applyCouponBtn");

  // Checkout Modal
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = document.getElementById("checkoutModal");
  const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutSummaryList = document.getElementById("checkoutSummaryList");
  const checkoutFinalTotal = document.getElementById("checkoutFinalTotal");

  // Quick View Modal
  const quickViewModal = document.getElementById("quickViewModal");
  const closeQuickViewBtn = document.getElementById("closeQuickViewBtn");
  const quickViewContent = document.getElementById("quickViewContent");

  // Order Success Modal
  const orderSuccessModal = document.getElementById("orderSuccessModal");
  const closeSuccessBtn = document.getElementById("closeSuccessBtn");
  const successOrderId = document.getElementById("successOrderId");

  // Mobile Menu
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  // -------------------------------------------------------------
  // Initial Setup
  // -------------------------------------------------------------
  renderProducts();
  updateCartUI();
  updateWishlistUI();
  initCountdownTimer();
  initBatConfigurator();

  // Listen for storage updates (sync with Admin Panel)
  window.addEventListener("productsUpdated", () => {
    state.products = DB.getProducts();
    renderProducts();
  });
  window.addEventListener("cartUpdated", () => updateCartUI());
  window.addEventListener("wishlistUpdated", () => {
    updateWishlistUI();
    renderProducts(); // refresh heart states
  });

  // -------------------------------------------------------------
  // Catalog Rendering & Filtering
  // -------------------------------------------------------------
  function renderProducts() {
    if (!productsGrid) return;

    let filtered = [...state.products];

    // Filter by Category
    if (state.selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category.toLowerCase() === state.selectedCategory.toLowerCase());
    }

    // Filter by Search Query
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sort Products
    if (state.sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (state.sortBy === "newest") {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    // Render HTML
    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-catalog-msg">
          <i class="fa-solid fa-box-open"></i>
          <h3>No cricket equipment found</h3>
          <p>Try searching with another keyword or pick a different category.</p>
        </div>
      `;
      return;
    }

    const wishlist = DB.getWishlist();

    productsGrid.innerHTML = filtered.map(product => {
      const isWishlisted = wishlist.includes(product.id);
      const isLowStock = product.stock > 0 && product.stock <= 5;
      const isOutOfStock = product.stock === 0;

      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-thumb-wrap">
            <span class="product-badge ${product.badge === 'Pro Grade' ? 'pro' : ''}">${product.badge || 'Official'}</span>
            <button class="wishlist-btn-corner ${isWishlisted ? 'active' : ''}" data-id="${product.id}" title="Save to Wishlist">
              <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop&q=80'">
            <button class="quick-view-overlay-btn" data-id="${product.id}">
              <i class="fa-regular fa-eye"></i> Quick View
            </button>
          </div>
          <div class="product-details">
            <div class="product-category-label">${product.subCategory || product.category}</div>
            <h3 class="product-title">${product.name}</h3>
            
            <div class="product-rating">
              <div class="stars">
                ${getStarIcons(product.rating || 4.8)}
              </div>
              <span class="reviews-num">(${product.reviewsCount || 12})</span>
            </div>

            <div class="product-specs-chips">
              ${product.weight ? `<span class="spec-chip"><i class="fa-solid fa-weight-hanging"></i> ${product.weight}</span>` : ''}
              ${product.grains ? `<span class="spec-chip"><i class="fa-solid fa-bars"></i> ${product.grains}</span>` : ''}
              ${isLowStock ? `<span class="spec-chip" style="color: #ef4444;"><i class="fa-solid fa-fire"></i> Only ${product.stock} left</span>` : ''}
            </div>

            <div class="product-price-row">
              <div class="price-box">
                <span class="current-price">${DB.formatCurrency(product.price, state.currentCurrency)}</span>
                ${product.originalPrice ? `<span class="original-price">${DB.formatCurrency(product.originalPrice, state.currentCurrency)}</span>` : ''}
              </div>
              <button class="add-cart-btn" data-id="${product.id}" ${isOutOfStock ? 'disabled title="Out of Stock"' : 'title="Add to Cart"'}>
                <i class="fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-cart-plus'}"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    attachProductListeners();
  }

  function getStarIcons(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="fa-solid fa-star"></i>';
      } else if (i - rating < 1) {
        stars += '<i class="fa-solid fa-star-half-stroke"></i>';
      } else {
        stars += '<i class="fa-regular fa-star"></i>';
      }
    }
    return stars;
  }

  function attachProductListeners() {
    // Add to Cart Buttons
    document.querySelectorAll(".add-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prodId = btn.getAttribute("data-id");
        const prod = state.products.find(p => p.id === prodId);
        if (prod) {
          DB.addToCart(prod, 1);
          showToast(`Added "${prod.name}" to your cricket bag!`, "success");
          openCartDrawer();
        }
      });
    });

    // Wishlist Buttons
    document.querySelectorAll(".wishlist-btn-corner").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prodId = btn.getAttribute("data-id");
        const res = DB.toggleWishlist(prodId);
        showToast(res.added ? "Item saved to Wishlist!" : "Item removed from Wishlist", "info");
      });
    });

    // Quick View Buttons
    document.querySelectorAll(".quick-view-overlay-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prodId = btn.getAttribute("data-id");
        openQuickView(prodId);
      });
    });
  }

  // -------------------------------------------------------------
  // Filter & Search Controls
  // -------------------------------------------------------------
  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      state.selectedCategory = tab.getAttribute("data-category");
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      state.currentCurrency = e.target.value;
      renderProducts();
      updateCartUI();
    });
  }

  // -------------------------------------------------------------
  // Cart Drawer Logic
  // -------------------------------------------------------------
  function openCartDrawer() {
    cartDrawer.classList.add("active");
    drawerBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeAllDrawers() {
    cartDrawer.classList.remove("active");
    wishlistDrawer.classList.remove("active");
    drawerBackdrop.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  if (cartTriggerBtn) cartTriggerBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeAllDrawers);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeAllDrawers);

  function updateCartUI() {
    const cart = DB.getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    if (cartCountBadge) {
      cartCountBadge.textContent = count;
      cartCountBadge.style.display = count > 0 ? "flex" : "none";
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <i class="fa-solid fa-cart-shopping" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
          <p style="font-weight: 600;">Your cricket kit bag is empty!</p>
          <p style="font-size: 0.8rem; margin-top: 4px;">Explore our world-class bats & equipment.</p>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = DB.formatCurrency(0, state.currentCurrency);
      if (cartDiscountEl) cartDiscountEl.textContent = DB.formatCurrency(0, state.currentCurrency);
      if (cartShippingEl) cartShippingEl.textContent = "Rs. 0";
      if (cartTotalEl) cartTotalEl.textContent = DB.formatCurrency(0, state.currentCurrency);
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item-card">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-specs">${item.weight || 'Standard'} • ${item.handle || 'Standard'}</div>
          <div class="cart-item-bottom">
            <span class="cart-item-price">${DB.formatCurrency(item.price * item.quantity, state.currentCurrency)}</span>
            <div class="qty-control">
              <button class="qty-btn" onclick="window.AliBabaApp.changeCartQty('${item.id}', -1)">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="window.AliBabaApp.changeCartQty('${item.id}', 1)">+</button>
            </div>
          </div>
        </div>
        <button class="remove-item-btn" onclick="window.AliBabaApp.removeCartItem('${item.id}')" title="Remove">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join("");

    // Calculate totals
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let discount = 0;

    if (state.activeCoupon) {
      if (state.activeCoupon.type === "percent") {
        discount = Math.round(subtotal * (state.activeCoupon.value / 100));
      } else if (state.activeCoupon.type === "fixed") {
        discount = state.activeCoupon.value;
      }
    }
    state.discountAmount = discount;

    const shipping = subtotal > 5000 ? 0 : 350;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    if (cartSubtotalEl) cartSubtotalEl.textContent = DB.formatCurrency(subtotal, state.currentCurrency);
    if (cartDiscountEl) cartDiscountEl.textContent = discount > 0 ? `-${DB.formatCurrency(discount, state.currentCurrency)}` : "Rs. 0";
    if (cartShippingEl) cartShippingEl.textContent = shipping === 0 ? "FREE" : DB.formatCurrency(shipping, state.currentCurrency);
    if (cartTotalEl) cartTotalEl.textContent = DB.formatCurrency(finalTotal, state.currentCurrency);
  }

  // Coupon handling
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (code === "CRICKET20") {
        state.activeCoupon = { code: "CRICKET20", type: "percent", value: 20 };
        showToast("Coupon Applied: 20% Instant Discount!", "success");
      } else if (code === "BABAR56") {
        state.activeCoupon = { code: "BABAR56", type: "fixed", value: 2500 };
        showToast("Champion Coupon: Rs. 2,500 Discount Applied!", "success");
      } else {
        showToast("Invalid coupon code. Try: CRICKET20", "warning");
      }
      updateCartUI();
    });
  }

  // Global helper bindings
  window.AliBabaApp = {
    changeCartQty(id, delta) {
      DB.updateCartQty(id, delta);
    },
    removeCartItem(id) {
      DB.removeFromCart(id);
      showToast("Item removed from your cart", "info");
    },
    moveToCartFromWishlist(id) {
      const prod = state.products.find(p => p.id === id);
      if (prod) {
        DB.addToCart(prod, 1);
        DB.toggleWishlist(id);
        showToast(`Moved "${prod.name}" to Cart!`, "success");
        openCartDrawer();
      }
    }
  };

  // -------------------------------------------------------------
  // Wishlist Drawer Logic
  // -------------------------------------------------------------
  function openWishlistDrawer() {
    wishlistDrawer.classList.add("active");
    drawerBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  if (wishlistTriggerBtn) wishlistTriggerBtn.addEventListener("click", openWishlistDrawer);
  if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", closeAllDrawers);

  function updateWishlistUI() {
    const wishlist = DB.getWishlist();
    if (wishlistCountBadge) {
      wishlistCountBadge.textContent = wishlist.length;
      wishlistCountBadge.style.display = wishlist.length > 0 ? "flex" : "none";
    }

    if (!wishlistItemsList) return;

    if (wishlist.length === 0) {
      wishlistItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <i class="fa-regular fa-heart" style="font-size: 2.5rem; margin-bottom: 12px; display: block;"></i>
          <p style="font-weight: 600;">Your wishlist is empty</p>
          <p style="font-size: 0.8rem; margin-top: 4px;">Tap the heart icon on any bat to bookmark it.</p>
        </div>
      `;
      return;
    }

    const items = state.products.filter(p => wishlist.includes(p.id));

    wishlistItemsList.innerHTML = items.map(item => `
      <div class="cart-item-card">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-price">${DB.formatCurrency(item.price, state.currentCurrency)}</span>
          <div style="margin-top: 8px;">
            <button class="btn-primary" style="padding: 5px 12px; font-size: 0.78rem;" onclick="window.AliBabaApp.moveToCartFromWishlist('${item.id}')">
              Move to Bag
            </button>
          </div>
        </div>
        <button class="remove-item-btn" onclick="DB.toggleWishlist('${item.id}')" title="Remove">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join("");
  }

  // -------------------------------------------------------------
  // Quick View Modal
  // -------------------------------------------------------------
  function openQuickView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product || !quickViewContent) return;

    quickViewContent.innerHTML = `
      <div class="quick-view-grid">
        <div>
          <img class="quick-view-img" src="${product.image}" alt="${product.name}">
        </div>
        <div>
          <span class="product-badge" style="position: static; display: inline-block; margin-bottom: 8px;">${product.badge || 'Professional Gear'}</span>
          <h2 style="font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 6px;">${product.name}</h2>
          <div class="product-rating" style="margin-bottom: 14px;">
            <div class="stars">${getStarIcons(product.rating || 4.9)}</div>
            <span class="reviews-num">${product.rating || 4.9} (${product.reviewsCount || 20} customer reviews)</span>
          </div>

          <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary); margin-bottom: 14px;">
            ${DB.formatCurrency(product.price, state.currentCurrency)}
            ${product.originalPrice ? `<span style="font-size: 1rem; color: var(--text-muted); text-decoration: line-through; margin-left: 10px;">${DB.formatCurrency(product.originalPrice, state.currentCurrency)}</span>` : ''}
          </div>

          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">${product.description}</p>

          <div class="spec-list">
            <div class="spec-item">
              <span>Category / Type</span>
              <span>${product.subCategory || product.category}</span>
            </div>
            <div class="spec-item">
              <span>Bat Weight / Profile</span>
              <span>${product.weight || '2.8 lbs (Customizable)'}</span>
            </div>
            <div class="spec-item">
              <span>Grains / Quality</span>
              <span>${product.grains || 'Hand Picked Premium'}</span>
            </div>
            <div class="spec-item">
              <span>Stock Availability</span>
              <span style="color: ${product.stock > 0 ? 'var(--primary)' : 'var(--accent-red)'}">
                ${product.stock > 0 ? `${product.stock} Units in Sialkot Warehouse` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div style="display: flex; gap: 14px; margin-top: 24px;">
            <button id="modalAddToCartBtn" class="btn-primary" style="flex-grow: 1; justify-content: center;" ${product.stock === 0 ? 'disabled' : ''}>
              <i class="fa-solid fa-cart-plus"></i> Add To Bag
            </button>
            <button id="modalWishlistBtn" class="btn-secondary" style="padding: 12px 18px;">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    quickViewModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Modal Add To Cart
    const modalAddBtn = document.getElementById("modalAddToCartBtn");
    if (modalAddBtn) {
      modalAddBtn.addEventListener("click", () => {
        DB.addToCart(product, 1);
        quickViewModal.classList.remove("active");
        showToast(`"${product.name}" added to cart!`, "success");
        openCartDrawer();
      });
    }

    // Modal Wishlist
    const modalWishBtn = document.getElementById("modalWishlistBtn");
    if (modalWishBtn) {
      modalWishBtn.addEventListener("click", () => {
        DB.toggleWishlist(product.id);
        quickViewModal.classList.remove("active");
        showToast("Wishlist updated", "info");
      });
    }
  }

  if (closeQuickViewBtn) {
    closeQuickViewBtn.addEventListener("click", () => {
      quickViewModal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  // -------------------------------------------------------------
  // Checkout Modal & Flow
  // -------------------------------------------------------------
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = DB.getCart();
      if (cart.length === 0) return;

      closeAllDrawers();
      renderCheckoutSummary();
      checkoutModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener("click", () => {
      checkoutModal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  function renderCheckoutSummary() {
    const cart = DB.getCart();
    if (!checkoutSummaryList) return;

    checkoutSummaryList.innerHTML = cart.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px;">
        <span style="color: #cbd5e1;">${item.name} <strong style="color: var(--primary);">x${item.quantity}</strong></span>
        <span style="font-weight: 700;">${DB.formatCurrency(item.price * item.quantity, state.currentCurrency)}</span>
      </div>
    `).join("");

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 5000 ? 0 : 350;
    const finalTotal = Math.max(0, subtotal - state.discountAmount + shipping);

    if (checkoutFinalTotal) {
      checkoutFinalTotal.textContent = DB.formatCurrency(finalTotal, state.currentCurrency);
    }
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const cart = DB.getCart();
      if (cart.length === 0) return;

      const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const shipping = subtotal > 5000 ? 0 : 350;
      const finalTotal = Math.max(0, subtotal - state.discountAmount + shipping);

      const customerName = document.getElementById("orderName").value.trim();
      const customerPhone = document.getElementById("orderPhone").value.trim();
      const customerEmail = document.getElementById("orderEmail").value.trim();
      const customerCity = document.getElementById("orderCity").value;
      const customerAddress = document.getElementById("orderAddress").value.trim();
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || "Cash on Delivery";

      const orderData = {
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          city: customerCity,
          address: customerAddress
        },
        items: cart,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod
      };

      // Place order in DB
      const placedOrder = DB.createOrder(orderData);
      DB.clearCart();

      // Close checkout modal & show success modal
      checkoutModal.classList.remove("active");
      if (successOrderId) successOrderId.textContent = placedOrder.id;
      orderSuccessModal.classList.add("active");
      showToast("Order Placed Successfully! Shukriya!", "success");
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", () => {
      orderSuccessModal.classList.remove("active");
      document.body.style.overflow = "auto";
      window.location.reload();
    });
  }

  // -------------------------------------------------------------
  // Interactive Cricket Bat Configurator
  // -------------------------------------------------------------
  function initBatConfigurator() {
    const playStylePills = document.querySelectorAll('[data-config="style"]');
    const willowPills = document.querySelectorAll('[data-config="willow"]');
    const weightPills = document.querySelectorAll('[data-config="weight"]');
    const handlePills = document.querySelectorAll('[data-config="handle"]');

    const previewWeight = document.getElementById("customWeightVal");
    const previewWillow = document.getElementById("customWillowVal");
    const previewPrice = document.getElementById("customPriceVal");
    const addCustomBatBtn = document.getElementById("addCustomBatBtn");

    let customBat = {
      name: "Ali Baba Custom Masterpiece Bat",
      style: "Power Hitter (Slight Low Swell)",
      willow: "Grade 1+ English Willow",
      weight: "2.8 lbs",
      handle: "Semi-Oval Cane",
      price: 58000
    };

    function updateConfig() {
      if (previewWeight) previewWeight.textContent = customBat.weight;
      if (previewWillow) previewWillow.textContent = customBat.willow;

      // Price calculation
      let base = 35000;
      if (customBat.willow.includes("Grade 1+")) base = 62000;
      else if (customBat.willow.includes("Grade 2")) base = 48000;
      else if (customBat.willow.includes("Kashmir")) base = 16000;

      customBat.price = base;
      if (previewPrice) previewPrice.textContent = DB.formatCurrency(base, state.currentCurrency);
    }

    function setupPillGroup(pills, field) {
      pills.forEach(pill => {
        pill.addEventListener("click", () => {
          pills.forEach(p => p.classList.remove("active"));
          pill.classList.add("active");
          customBat[field] = pill.getAttribute("data-val");
          updateConfig();
        });
      });
    }

    setupPillGroup(playStylePills, "style");
    setupPillGroup(willowPills, "willow");
    setupPillGroup(weightPills, "weight");
    setupPillGroup(handlePills, "handle");

    if (addCustomBatBtn) {
      addCustomBatBtn.addEventListener("click", () => {
        const customProduct = {
          id: "ABS-CUSTOM-" + Date.now().toString().slice(-4),
          name: `Ali Baba Custom Bat (${customBat.willow.split(" ")[0]} - ${customBat.weight})`,
          price: customBat.price,
          image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop&q=80",
          category: "bats",
          weight: customBat.weight,
          handle: customBat.handle
        };
        DB.addToCart(customProduct, 1, { weight: customBat.weight, handle: customBat.handle });
        showToast("Your custom tailored bat has been added to your kit bag!", "success");
        openCartDrawer();
      });
    }

    updateConfig();
  }

  // -------------------------------------------------------------
  // Live Flash Sale Countdown Timer
  // -------------------------------------------------------------
  function initCountdownTimer() {
    const hoursEl = document.getElementById("timerHours");
    const minsEl = document.getElementById("timerMins");
    const secsEl = document.getElementById("timerSecs");
    if (!hoursEl || !minsEl || !secsEl) return;

    // Fixed countdown of 18 hours from now
    let duration = 18 * 3600 + 42 * 60 + 15;

    setInterval(() => {
      duration--;
      if (duration <= 0) duration = 24 * 3600;

      const h = Math.floor(duration / 3600);
      const m = Math.floor((duration % 3600) / 60);
      const s = Math.floor(duration % 60);

      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }, 1000);
  }

  // -------------------------------------------------------------
  // Toast Notifications
  // -------------------------------------------------------------
  function showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-circle-check";
    if (type === "warning") icon = "fa-triangle-exclamation";
    if (type === "error") icon = "fa-circle-xmark";
    if (type === "info") icon = "fa-circle-info";

    toast.innerHTML = `
      <i class="fa-solid ${icon}" style="color: ${type === 'success' ? 'var(--primary)' : type === 'warning' ? 'var(--accent-gold)' : 'var(--accent-red)'}"></i>
      <span style="font-size: 0.9rem; font-weight: 600;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Mobile Menu Toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("mobile-open");
    });
  }
});
