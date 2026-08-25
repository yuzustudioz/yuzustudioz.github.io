(() => {
  "use strict";

  const WHATSAPP_NUMBER = "919561673726";
  const STORAGE_KEY = "buildo-cart-v3";

  const products = [];

async function loadProducts() {
    try {
        const response = await fetch("assets/products.json", { cache: "no-store" });
        if (!response.ok) throw new Error(`Could not load products.json (${response.status})`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("products.json must contain an array.");
        products.splice(0, products.length, ...data);
        if (typeof initializeStore === "function") {
            initializeStore();
        }
        if (typeof renderShop === "function") {
            const requestedCategory = new URLSearchParams(location.search).get("category") || "all";
            renderShop(requestedCategory);
        }
    } catch (error) {
        console.error(error);
        document.querySelectorAll("[data-products-error]").forEach(el => {
            el.textContent = "Unable to load products. Please refresh the page.";
        });
    }
}

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
        <a class="product-image product-link" href="product.html?id=${p.id}" aria-label="View ${p.name}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          <span class="product-emoji">${p.emoji}</span>
        </a>
        <div class="product-info">
          <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
          <div class="price">${money(p.price)} <span class="old">${money(p.old)}</span></div>
          <button class="add" type="button" data-add="${p.id}">ADD TO BAG</button>
        </div>
      </article>`;
  }

  function renderProductDetail() {
    const mount = $("productDetail");
    if (!mount) return;

    const id = Number(new URLSearchParams(location.search).get("id"));
    const p = products.find(x => x.id === id) || products[0];
    document.title = `${p.name} — BUILDO`;

    mount.innerHTML = `
      <div class="product-breadcrumb"><a href="index.html">Home</a><span> / </span><a href="index.html#products">Shop</a><span> / ${p.name}</span></div>
      <div class="product-detail-grid">
        <div class="detail-art">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          <span>${p.emoji}</span>
        </div>
        <div class="detail-copy">
          <div class="eyebrow">${p.cat === "mini" ? "MINIATURES" : p.cat.toUpperCase()}</div>
          <h1>${p.name}</h1>
          <p class="detail-description">${p.description}</p>
          <div class="detail-price">${money(p.price)} <span class="old">${money(p.old)}</span></div>
          <div class="detail-stock">✓ IN STOCK · READY TO DISPATCH</div>

          <div class="offer-card">
            <strong>🎁 Offers</strong>
            ${p.offers.map(x => `<div>• ${x}</div>`).join("")}
          </div>

          <div class="detail-actions">
            <div class="quantity"><button type="button" data-detail-qty="-1">−</button><strong id="detailQty">1</strong><button type="button" data-detail-qty="1">+</button></div>
            <button class="btn btn-dark detail-add" type="button" data-detail-add="${p.id}">ADD TO BAG →</button>
          </div>

          <button class="detail-buy" type="button" data-detail-buy="${p.id}">BUY IT NOW</button>

          <div class="info-rows">
            <div><span>Dimensions</span><b>${p.dimensions}</b></div>
            <div><span>Material</span><b>${p.material}</b></div>
            <div><span>Weight</span><b>${p.weight}</b></div>
            <div><span>What's included</span><b>${p.quantity}</b></div>
          </div>
        </div>
      </div>

      <div class="product-long-details">
        <div><div class="eyebrow">PRODUCT DETAILS</div><h2>Everything you need to know.</h2></div>
        <div class="long-copy">
          <h3>Description</h3><p>${p.description}</p>
          <h3>Features</h3><ul>${p.features.map(x => `<li>${x}</li>`).join("")}</ul>
          <h3>Shipping & offers</h3><p>Products are packed carefully before dispatch. Delivery timelines depend on your location. ${p.offers.join(" · ")}.</p>
        </div>
      </div>

      <section class="related-section">
        <div class="eyebrow">KEEP EXPLORING</div><h2>You might also like</h2>
        <div class="product-grid">${products.filter(x => x.id !== p.id).slice(0,4).map(productCard).join("")}</div>
      </section>`;
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

    document.addEventListener("click", event => {
      const qtyButton = event.target.closest("[data-detail-qty]");
      if (qtyButton) {
        const qty = $("detailQty");
        if (qty) qty.textContent = Math.max(1, Number(qty.textContent || 1) + Number(qtyButton.dataset.detailQty));
      }
      const addButton = event.target.closest("[data-detail-add]");
      if (addButton) {
        const qty = Math.max(1, Number($("detailQty")?.textContent || 1));
        for (let i = 0; i < qty; i++) addToCart(Number(addButton.dataset.detailAdd));
        showToast("Added to your bag ✨");
      }
      const buyButton = event.target.closest("[data-detail-buy]");
      if (buyButton) {
        const qty = Math.max(1, Number($("detailQty")?.textContent || 1));
        for (let i = 0; i < qty; i++) addToCart(Number(buyButton.dataset.detailBuy));
        location.href = "index.html?openCart=1";
      }
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

  function initializeStore() {

    renderProducts();
    renderMostSearched();
    renderProductDetail();
    renderCart();
    updateCount();
    bindEvents();
    if (new URLSearchParams(location.search).get("openCart") === "1") {
      setTimeout(openCart, 80);
    }
  
}
  document.addEventListener("DOMContentLoaded", loadProducts, { once: true });

  function renderShop(filter = "all") {
    const grid = $("shopGrid");
    const filters = $("shopFilters");
    const count = $("shopCount");
    if (!grid) return;

    const categories = [...new Set(products.map(p => p.cat).filter(Boolean))];

    if (filters) {
      filters.innerHTML =
        `<button class="filter ${filter === "all" ? "active" : ""}" data-shop-filter="all">All</button>` +
        categories.map(cat =>
          `<button class="filter ${cat === filter ? "active" : ""}" data-shop-filter="${cat}">
            ${String(cat).replace(/-/g, " ")}
          </button>`
        ).join("");

      if (!filters.dataset.bound) {
        filters.dataset.bound = "1";
        filters.addEventListener("click", event => {
          const button = event.target.closest("[data-shop-filter]");
          if (!button) return;
          renderShop(button.dataset.shopFilter);
        });
      }
    }

    const visible = filter === "all" ? products : products.filter(p => p.cat === filter);
    if (count) count.textContent = `${visible.length} product${visible.length === 1 ? "" : "s"}`;

    grid.innerHTML = visible.map(productCard).join("");

    if (!grid.dataset.bound) {
      grid.dataset.bound = "1";
      grid.addEventListener("click", event => {
        const button = event.target.closest("[data-add]");
        if (button) {
          event.preventDefault();
          event.stopPropagation();
          addToCart(Number(button.dataset.add));
        }
      });
    }
  }

  window.renderShop = renderShop;

})();
