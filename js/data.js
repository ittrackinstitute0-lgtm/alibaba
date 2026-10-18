/**
 * Ali Baba Sports - Data Store & LocalStorage Controller
 * Manages cricket products, orders, cart, wishlist, and settings.
 */

// Default Seed Products (12 Authentic High-Performance Cricket Items)
const DEFAULT_PRODUCTS = [
  {
    id: "ABS-101",
    name: "CA Plus 15000 Player Edition",
    category: "bats",
    subCategory: "English Willow",
    price: 65000,
    originalPrice: 78000,
    stock: 8,
    rating: 4.9,
    reviewsCount: 38,
    badge: "Bestseller",
    weight: "2.8 lbs",
    grains: "9-12 Straight Grains",
    handle: "Semi-Oval 12 Piece Cane",
    image: "https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=800&auto=format&fit=crop&q=80",
    description: "Handcrafted from top 1% Grade 1+ English Willow. Massive edges (39-41mm), super balanced pick-up, customized for destructive stroke play. Used by top international cricketers.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-102",
    name: "Kookaburra Kahuna Pro 4.0",
    category: "bats",
    subCategory: "English Willow",
    price: 52000,
    originalPrice: 62000,
    stock: 5,
    rating: 4.8,
    reviewsCount: 29,
    badge: "Pro Grade",
    weight: "2.9 lbs",
    grains: "8-10 Grains",
    handle: "Round Dynamic Cane",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80",
    description: "Iconic green Kahuna profile with high spine and mid-blade sweet spot. Ideal for 360-degree all-round stroke players who demand feather-light pick-up with devastating power.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-103",
    name: "Gray-Nicolls Oblivion Stealth 1500",
    category: "bats",
    subCategory: "English Willow",
    price: 48000,
    originalPrice: 55000,
    stock: 12,
    rating: 4.7,
    reviewsCount: 19,
    badge: "Hot Deal",
    weight: "2.7 lbs",
    grains: "7-9 Grains",
    handle: "Oval Multi-layer",
    image: "https://images.unsplash.com/photo-1531415074868-036b1c57e359?w=800&auto=format&fit=crop&q=80",
    description: "Sleek chrome/matte styling with a contoured spine and ultra-light pickup. Tested in England for high rebound speed and extreme control on bouncy tracks.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-104",
    name: "Ali Baba Sialkot Special Kashmir Willow",
    category: "bats",
    subCategory: "Kashmir Willow",
    price: 14500,
    originalPrice: 18000,
    stock: 25,
    rating: 4.6,
    reviewsCount: 64,
    badge: "Club Choice",
    weight: "2.8 lbs",
    grains: "Natural Pressed",
    handle: "Full Cane Handle",
    image: "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?w=800&auto=format&fit=crop&q=80",
    description: "Finest seasoned Kashmir Willow pressed for tennis & heavy tape ball or hard ball club cricket. Thick toe with fiber glass protective tape pre-applied.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "ABS-105",
    name: "Kookaburra Turf Pink Leather Ball (Pack of 2)",
    category: "balls",
    subCategory: "Leather Balls",
    price: 8500,
    originalPrice: 10500,
    stock: 30,
    rating: 4.9,
    reviewsCount: 42,
    badge: "Official Spec",
    weight: "156 grams",
    grains: "Alum Tanned Leather",
    handle: "Standard 4-Piece",
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop&q=80",
    description: "Day-Night Test match specification pink 4-piece leather ball. Hand-stitched with 78-80 seams for pronounced swing and lasting shine under floodlights.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-106",
    name: "CA Gold Star Red Match Ball (Box of 6)",
    category: "balls",
    subCategory: "Leather Balls",
    price: 13500,
    originalPrice: 16000,
    stock: 14,
    rating: 4.8,
    reviewsCount: 31,
    badge: "Tournament Box",
    weight: "156g each",
    grains: "Grade A Steerhide",
    handle: "Lacquer Finished",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800&auto=format&fit=crop&q=80",
    description: "Premium Portuguese cork core wrapped with Australian wool yarn and top grain cowhide. Excellent seam retention over 50+ overs of intense cricket.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "ABS-107",
    name: "Shrey Masterclass Air 2.0 Titanium Helmet",
    category: "protective",
    subCategory: "Helmets",
    price: 24000,
    originalPrice: 28000,
    stock: 9,
    rating: 5.0,
    reviewsCount: 27,
    badge: "Max Protection",
    weight: "740 grams",
    grains: "Titanium Grille",
    handle: "Dual-Density EPS Liner",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80",
    description: "Weighs only 740g with Grade 5 Titanium visor and advanced ventilation channels. Meets the latest British Safety Standard BS 7928:2013 for 95mph bouncers.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-108",
    name: "CA Plus 15000 Batting Gloves (Shark Skin)",
    category: "protective",
    subCategory: "Gloves",
    price: 11500,
    originalPrice: 14000,
    stock: 18,
    rating: 4.9,
    reviewsCount: 53,
    badge: "Pro Choice",
    weight: "Ultra Light",
    grains: "Pittards Leather Palm",
    handle: "Split Finger Flex Tech",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    description: "Equipped with high-density plastazote foam and shark-tooth split fingers. Pittards world-class sheepskin palm offers supreme grip in humid sub-continental heat.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-109",
    name: "Gray-Nicolls Pro Legend Batting Legguards",
    category: "protective",
    subCategory: "Pads",
    price: 18500,
    originalPrice: 22000,
    stock: 10,
    rating: 4.8,
    reviewsCount: 22,
    badge: "Ergonomic",
    weight: "Lightweight Cane",
    grains: "7-Rib Traditional",
    handle: "Gel-Zone Knee Cup",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80",
    description: "Classic cane protection combined with modern HD foam wings and gel knee socket. Offers total tibia and knee joint defense without sacrificing sprinting agility.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "ABS-110",
    name: "Ali Baba Imperial Pro Wheelie Cricket Kit Bag",
    category: "bags",
    subCategory: "Kit Bags",
    price: 19500,
    originalPrice: 24000,
    stock: 11,
    rating: 4.9,
    reviewsCount: 45,
    badge: "Heavy Duty",
    weight: "3.2 kg",
    grains: "1680D Ballistic Nylon",
    handle: "Heavy Duty Triple Wheels",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    description: "Massive 120L capacity fits 3 bats in padded thermo-lined side pockets, dedicated shoe tunnel, helmet pocket, pad straps, and heavy all-terrain trolley wheels.",
    inStock: true,
    isFeatured: true
  },
  {
    id: "ABS-111",
    name: "New Balance CK10v4 Cricket Spikes Shoes",
    category: "shoes",
    subCategory: "Shoes",
    price: 27500,
    originalPrice: 32000,
    stock: 7,
    rating: 4.8,
    reviewsCount: 16,
    badge: "Speed & Grip",
    weight: "380 grams",
    grains: "Steel & TPU Spike Combo",
    handle: "REVlite Cushioning",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    description: "Engineered for fast bowlers and agile batsmen. Responsive REVlite midsole absorbs heel strike impact while the 11-spike plate provides ferocious traction on turf wickets.",
    inStock: true,
    isFeatured: false
  },
  {
    id: "ABS-112",
    name: "Ali Baba Pakistan Pro Match Dry-Fit Jersey",
    category: "apparel",
    subCategory: "Jerseys",
    price: 4500,
    originalPrice: 6000,
    stock: 40,
    rating: 4.9,
    reviewsCount: 88,
    badge: "Fan Favorite",
    weight: "Light Breathable",
    grains: "100% Micro Polyester",
    handle: "Athletic Slim Fit",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    description: "Laser-cut ventilation eyelets, moisture-wicking anti-odor fabric, and official high-definition sublimated crest. Stay cool under extreme match pressures.",
    inStock: true,
    isFeatured: true
  }
];

// Initial Realistic Sample Orders for Admin Panel
const DEFAULT_ORDERS = [
  {
    id: "ORD-9421",
    customer: {
      name: "Babar Azam",
      phone: "+92 300 1234567",
      email: "babar.cricket@gmail.com",
      city: "Lahore",
      address: "DHA Phase 6, Sector C, House 14"
    },
    items: [
      { id: "ABS-101", name: "CA Plus 15000 Player Edition", price: 65000, quantity: 1 }
    ],
    totalAmount: 65000,
    paymentMethod: "Bank Transfer",
    status: "Delivered",
    date: "2026-10-15 14:30"
  },
  {
    id: "ORD-9422",
    customer: {
      name: "Shaheen Afridi",
      phone: "+92 312 9876543",
      email: "shaheen.pace@gmail.com",
      city: "Islamabad",
      address: "F-7/2, Street 18, House 9"
    },
    items: [
      { id: "ABS-105", name: "Kookaburra Turf Pink Leather Ball (Pack of 2)", price: 8500, quantity: 2 },
      { id: "ABS-111", name: "New Balance CK10v4 Cricket Spikes", price: 27500, quantity: 1 }
    ],
    totalAmount: 44500,
    paymentMethod: "JazzCash",
    status: "Shipped",
    date: "2026-10-17 11:15"
  },
  {
    id: "ORD-9423",
    customer: {
      name: "Muhammad Rizwan",
      phone: "+92 333 4567890",
      email: "rizwan.keeper@gmail.com",
      city: "Peshawar",
      address: "Hayatabad Phase 3, Street 5"
    },
    items: [
      { id: "ABS-107", name: "Shrey Masterclass Air 2.0 Titanium Helmet", price: 24000, quantity: 1 },
      { id: "ABS-108", name: "CA Plus 15000 Batting Gloves", price: 11500, quantity: 1 }
    ],
    totalAmount: 35500,
    paymentMethod: "Cash on Delivery",
    status: "Processing",
    date: "2026-10-18 09:40"
  },
  {
    id: "ORD-9424",
    customer: {
      name: "Haris Rauf",
      phone: "+92 345 6789123",
      email: "haris.150kph@gmail.com",
      city: "Rawalpindi",
      address: "Satellite Town, Commercial Market area"
    },
    items: [
      { id: "ABS-110", name: "Ali Baba Imperial Pro Wheelie Cricket Kit Bag", price: 19500, quantity: 1 }
    ],
    totalAmount: 19500,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    date: "2026-10-18 16:20"
  }
];

// Storage Helper
const DB = {
  // Get all products
  getProducts() {
    const data = localStorage.getItem("ali_baba_products");
    if (!data) {
      localStorage.setItem("ali_baba_products", JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_PRODUCTS;
    }
  },

  // Save products
  saveProducts(products) {
    localStorage.setItem("ali_baba_products", JSON.stringify(products));
    window.dispatchEvent(new Event("productsUpdated"));
  },

  // Add new product
  addProduct(product) {
    const products = this.getProducts();
    product.id = "ABS-" + Math.floor(100 + Math.random() * 900);
    products.unshift(product);
    this.saveProducts(products);
    return product;
  },

  // Update existing product
  updateProduct(updatedProduct) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      this.saveProducts(products);
      return true;
    }
    return false;
  },

  // Delete product
  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    return true;
  },

  // Reset to default sample products
  resetDefaultProducts() {
    localStorage.setItem("ali_baba_products", JSON.stringify(DEFAULT_PRODUCTS));
    window.dispatchEvent(new Event("productsUpdated"));
    return DEFAULT_PRODUCTS;
  },

  // Get Orders
  getOrders() {
    const data = localStorage.getItem("ali_baba_orders");
    if (!data) {
      localStorage.setItem("ali_baba_orders", JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_ORDERS;
    }
  },

  // Save Orders
  saveOrders(orders) {
    localStorage.setItem("ali_baba_orders", JSON.stringify(orders));
    window.dispatchEvent(new Event("ordersUpdated"));
  },

  // Create new order
  createOrder(orderData) {
    const orders = this.getOrders();
    const newOrder = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Pending",
      ...orderData
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);

    // Also deduct stock from products
    const products = this.getProducts();
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach(cartItem => {
        const prod = products.find(p => p.id === cartItem.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (cartItem.quantity || 1));
          if (prod.stock === 0) prod.inStock = false;
        }
      });
      this.saveProducts(products);
    }

    return newOrder;
  },

  // Update Order Status
  updateOrderStatus(orderId, newStatus) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders(orders);
      return true;
    }
    return false;
  },

  // Cart Management
  getCart() {
    try {
      return JSON.parse(localStorage.getItem("ali_baba_cart")) || [];
    } catch {
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem("ali_baba_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  },

  addToCart(product, quantity = 1, selectedSpecs = {}) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity,
        weight: selectedSpecs.weight || product.weight || "Standard",
        handle: selectedSpecs.handle || product.handle || "Standard"
      });
    }
    this.saveCart(cart);
    return cart;
  },

  updateCartQty(productId, delta) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
      this.saveCart(cart);
    }
    return cart;
  },

  removeFromCart(productId) {
    let cart = this.getCart();
    cart = cart.filter(i => i.id !== productId);
    this.saveCart(cart);
    return cart;
  },

  clearCart() {
    this.saveCart([]);
  },

  // Wishlist Management
  getWishlist() {
    try {
      return JSON.parse(localStorage.getItem("ali_baba_wishlist")) || [];
    } catch {
      return [];
    }
  },

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      wishlist.splice(index, 1);
    } else {
      wishlist.push(productId);
      added = true;
    }
    localStorage.setItem("ali_baba_wishlist", JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
    return { wishlist, added };
  },

  // Currency helper
  formatCurrency(amount, currency = "PKR") {
    if (currency === "USD") {
      const usdVal = (amount / 280).toFixed(2);
      return `$${Number(usdVal).toLocaleString()}`;
    }
    return `Rs. ${Number(amount).toLocaleString()}`;
  }
};

// Initialize localStorage on first load
if (!localStorage.getItem("ali_baba_products")) {
  DB.getProducts();
}
if (!localStorage.getItem("ali_baba_orders")) {
  DB.getOrders();
}
