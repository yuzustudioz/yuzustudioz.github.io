(() => {
  "use strict";

  const WHATSAPP_NUMBER = "919876543210";
  const STORAGE_KEY = "buildo-cart-v3";

  const products = [
    {id:1,name:"Miniature Glow Rabbit",price:20,old:29,cat:"mini",emoji:"🐇",badge:"PRICE DROP"},
    {id:2,name:"Miniature Glow Elephant",price:29,old:45,cat:"mini",emoji:"🐘"},
    {id:3,name:"Spacecraft Building Block",price:199,old:349,cat:"space",emoji:"🚀",badge:"PRICE DROP"},
    {id:4,name:"Classic Red Rose Pot",price:129,old:159,cat:"flowers",emoji:"🌹"},
    {id:5,name:"Rabbit Building Block",price:79,old:119,cat:"animals",emoji:"🐰"},
    {id:6,name:"Elephant Building Block",price:79,old:119,cat:"animals",emoji:"🐘"},
    {id:7,name:"Space Station Building Block",price:199,old:349,cat:"space",emoji:"🛸",badge:"PRICE DROP"},
    {id:8,name:"Golden Sunflower Pot",price:129,old:159,cat:"flowers",emoji:"🌻"},
    {id:9,name:"Pug Building Block",price:79,old:119,cat:"animals",emoji:"🐶"},
    {id:10,name:"Miniature Cute Piglet",price:29,old:45,cat:"mini",emoji:"🐷"},
    {id:11,name:"Apollo Space Rocket",price:199,old:299,cat:"space",emoji:"🚀"},
    {id:12,name:"Spring Blossom Tree",price:199,old:249,cat:"flowers",emoji:"🌸"},
    {id:13,name:"Tricera Building Block",price:79,old:119,cat:"animals",emoji:"🦕"},
    {id:14,name:"Dachshund Building Block",price:79,old:119,cat:"animals",emoji:"🐕"},
    {id:15,name:"Miniature Panda",price:55,old:75,cat:"mini",emoji:"🐼"},
    {id:16,name:"Star Mission Rocket",price:199,old:299,cat:"space",emoji:"🚀",badge:"PRICE DROP"}
  ];

  let cart = loadCart();

  function $(id) {
    return document.getElementById(id);
  }

  function money(value) {
    return "₹" + Number(value).toLocaleString("en-IN");
  }

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(x => Number.isInteger(x.id) && x.qty > 0) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    renderCart();
    updateCount();
  }

  function productCard(p) {
    return `
      <article class="product-card">
        <div class="product-image">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          <span class="product-emoji">${p.emoji}</span>
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div>
          <button class="add" type="button" data-add="${p.id}">ADD TO BAG</button>
        </div>
      </article>`;
  }

  function renderProducts(filter = "all") {
    const grid = $("productGrid");
    if (!grid) return;
    const list = filter === "all" ? products : products.filter(p => p.cat === filter);
    grid.innerHTML = list.map(productCard).join("");
  }

  function renderMostSearched() {
    const grid = $("mostSearched");
    if (!grid) return;
    grid.innerHTML = products.slice(0, 5).map(productCard).join("");
  }

  function updateCount() {
    const count = $("cartCount");
    if (!count) return;
    count.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function renderCart() {
    const box = $("cartItems");
    const totalEl = $("cartTotal");
    if (!box || !totalEl) return;

    if (!cart.length) {
      box.innerHTML = `<div class="empty"><div style="font-size:45px">🛍️</div><h3>Your bag is empty</h3><p>Start adding little things you love.</p></div>`;
      totalEl.textContent = "₹0";
      return;
    }

    let total = 0;
    box.innerHTML = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      if (!p) return "";
      const lineTotal = p.price * item.qty;
      total += lineTotal;
      return `
        <div class="cart-line">
          <div class="cart-thumb">${p.emoji}</div>
          <div>
            <h4>${p.name}</h4>
            <small>${money(p.price)} × ${item.qty}</small><br>
            <button class="remove" type="button" data-remove="${p.id}">Remove</button>
          </div>
          <strong>${money(lineTotal)}</strong>
        </div>`;
    }).join("");

    totalEl.textContent = money(total);
  }

  function addToCart(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const existing = cart.find(x => x.id === id);
    if (existing) existing.qty += 1;
    else cart.push({id, qty:1});
    saveCart();
    showToast(`${p.name} added to your bag`);
  }

  function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    saveCart();
  }

  function openCart() {
    const drawer = $("cartDrawer");
    const backdrop = $("backdrop");
    if (!drawer || !backdrop) return;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeCart() {
    const drawer = $("cartDrawer");
    const backdrop = $("backdrop");
    if (drawer) {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
    }
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function openCheckout() {
    if (!cart.length) {
      showToast("Your bag is empty");
      return;
    }
    const modal = $("checkoutModal");
    if (!modal) {
      showToast("Checkout could not be loaded. Please refresh the page.");
      return;
    }
    closeCart();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    const name = $("customerName");
    if (name) setTimeout(() => name.focus(), 50);
  }

  function closeCheckout() {
    const modal = $("checkoutModal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function buildWhatsAppMessage(name, phone, address) {
    let total = 0;
    const lines = cart.map(item => {
      const p = products.find(x => x.id === item.id);
      if (!p) return null;
      const lineTotal = p.price * item.qty;
      total += lineTotal;
      return `${item.qty} × ${p.name} — ${money(lineTotal)}`;
    }).filter(Boolean);

    return [
      "Hi! I'd like to place an order:",
      "",
      "🛍️ ORDER",
      ...lines,
      "",
      `Subtotal: ${money(total)}`,
      "",
      "👤 CUSTOMER DETAILS",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Delivery Address: ${address}`,
      "",
      "Please confirm my order. Thanks!"
    ].join("\n");
  }

  function submitWhatsAppOrder(event) {
    event.preventDefault();

    if (!cart.length) {
      closeCheckout();
      showToast("Your bag is empty");
      return;
    }

    const nameEl = $("customerName");
    const phoneEl = $("customerPhone");
    const addressEl = $("customerAddress");
    if (!nameEl || !phoneEl || !addressEl) {
      showToast("Checkout form could not be loaded. Please refresh.");
      return;
    }

    const name = nameEl.value.trim();
    const phone = phoneEl.value.trim();
    const address = addressEl.value.trim();

    if (!name || !phone || !address) {
      showToast("Please fill in all details");
      return;
    }

    const message = buildWhatsAppMessage(name, phone, address);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // window.location.href is intentionally used as a fallback-friendly
    // navigation. It works with WhatsApp Web on desktop and the WhatsApp
    // app handoff on supported mobile browsers.
    window.location.href = url;
  }

  function openSearch() {
    const overlay = $("searchOverlay");
    if (!overlay) return;
    overlay.hidden = false;
    const input = $("searchInput");
    if (input) setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    const overlay = $("searchOverlay");
    if (overlay) overlay.hidden = true;
  }

  function searchProducts(query) {
    const results = $("searchResults");
    if (!results) return;
    const q = query.trim().toLowerCase();
    if (!q) {
      results.innerHTML = "";
      return;
    }
    const matches = products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(p => `<div class="search-result"><span>${p.emoji} ${p.name}</span><span>${money(p.price)}</span></div>`).join("")
      : "<p>No products found.</p>";
  }

  function toggleMobileMenu() {
    const nav = $("mainNav");
    const button = $("mobileMenuBtn");
    if (!nav || !button) return;
    const open = nav.classList.toggle("mobile-open");
    button.setAttribute("aria-expanded", String(open));
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__buildoToast);
    window.__buildoToast = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function subscribe(event) {
    event.preventDefault();
    event.target.reset();
    showToast("You're on the list ✨");
  }

  function bindEvents() {
    const productArea = $("productGrid");
    const mostArea = $("mostSearched");

    [productArea, mostArea].forEach(area => {
      if (!area) return;
      area.addEventListener("click", event => {
        const button = event.target.closest("[data-add]");
        if (button) addToCart(Number(button.dataset.add));
      });
    });

    const filterRow = $("filterRow");
    if (filterRow) {
      filterRow.addEventListener("click", event => {
        const button = event.target.closest("[data-filter]");
        if (!button) return;
        filterRow.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
        button.classList.add("active");
        renderProducts(button.dataset.filter);
      });
    }

    $("bagBtn")?.addEventListener("click", openCart);
    $("cartClose")?.addEventListener("click", closeCart);
    $("backdrop")?.addEventListener("click", closeCart);
    $("checkoutBtn")?.addEventListener("click", openCheckout);
    $("checkoutClose")?.addEventListener("click", closeCheckout);
    $("checkoutForm")?.addEventListener("submit", submitWhatsAppOrder);

    $("searchBtn")?.addEventListener("click", openSearch);
    $("searchClose")?.addEventListener("click", closeSearch);
    $("searchInput")?.addEventListener("input", event => searchProducts(event.target.value));

    $("mobileMenuBtn")?.addEventListener("click", toggleMobileMenu);
    $("newsletterForm")?.addEventListener("submit", subscribe);

    $("cartItems")?.addEventListener("click", event => {
      const button = event.target.closest("[data-remove]");
      if (button) removeFromCart(Number(button.dataset.remove));
    });

    $("checkoutModal")?.addEventListener("click", event => {
      if (event.target.id === "checkoutModal") closeCheckout();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeSearch();
        closeCart();
        closeCheckout();
      }
    });

    document.querySelectorAll("#mainNav a").forEach(link => {
      link.addEventListener("click", () => {
        $("mainNav")?.classList.remove("mobile-open");
        $("mobileMenuBtn")?.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
    renderMostSearched();
    renderCart();
    updateCount();
    bindEvents();
  });
})();
