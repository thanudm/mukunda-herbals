/* ============================================================
   Mukunda Herbal — interactions
   Cart, filters, WhatsApp checkout, navigation.
   ============================================================ */

(function () {
  "use strict";

  document.body.classList.add("anim-ready");

  /* ---------- Category colors (used by cart thumbnails) ---------- */
  var CAT_COLORS = {
    hair:  "#2f5233",
    soaps: "#a67c2e",
    oils:  "#6f9e3d",
    henna: "#7a4a21",
    lips:  "#b3261e"
  };

  function catColor(key) {
    return CAT_COLORS[key] || "#2f5233";
  }

  /* ---------- Category circles (inline SVG, no image requests) ---------- */
  var CAT_ICONS = {
    hair:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V9"/><path d="M12 9c-3 0-5 2-6 5 3 0 5-2 6-5Z"/><path d="M12 9c3 0 5 2 6 5-3 0-5-2-6-5Z"/></svg>',
    soaps:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="10" width="10" height="7" rx="2"/><path d="M9 10V8a3 3 0 0 1 6 0v2"/><circle cx="16.5" cy="7" r="1.4"/></svg>',
    oils:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 4.5 5 8 5 11.5a5 5 0 0 1-10 0C7 11 9 7.5 12 3Z"/></svg>',
    henna:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4c2.2 2.4 2.2 5 0 7.5-2.2-2.5-2.2-5.1 0-7.5Z"/><path d="M6 9c2.6 0 4.7 1.6 5.3 4-2.4.4-4.7-.4-5.3-4Z"/><path d="M18 9c-2.6 0-4.7 1.6-5.3 4 2.4.4 4.7-.4 5.3-4Z"/><path d="M12 13v7"/></svg>',
    lips:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="4" width="4" height="3" rx="1"/><rect x="9.2" y="7" width="5.6" height="13" rx="2.2"/><path d="M16 13.5c-1.4 2-2.4 2.8-4 2.8s-2.6-.8-4-2.8"/><path d="M10 10.5h4"/></svg>'
  };

  var catsEl = document.getElementById("cats");
  if (catsEl) {
    catsEl.innerHTML = CATEGORIES
      .map(function (c) {
        return (
          '<a class="cat reveal" href="#shop" data-goto="' + c.key + '">' +
            '<span class="cat__ico" style="background:' + catColor(c.key) + '">' + (CAT_ICONS[c.key] || CAT_ICONS.hair) + "</span>" +
            "<h3>" + c.label + "</h3>" +
          "</a>"
        );
      })
      .join("");
  }

  /* ---------- Filter chips ---------- */
  var filtersEl = document.getElementById("filters");
  if (filtersEl) {
    filtersEl.innerHTML =
      '<button class="chip active" data-filter="all">All Products</button>' +
      CATEGORIES.map(function (c) {
        return '<button class="chip" data-filter="' + c.key + '">' + c.label + "</button>";
      }).join("");
  }

  /* ---------- Card visibility by filter ---------- */
  var grid = document.getElementById("productGrid");
  var activeFilter = "all";

  function applyFilter() {
    var cards = grid.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++) {
      var cats = cards[i].dataset.category.split(" ");
      var show = activeFilter === "all" || cats.indexOf(activeFilter) !== -1;
      cards[i].style.display = show ? "" : "none";
    }
    observeReveals();
  }

  filtersEl.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip");
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    var chips = filtersEl.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("active", chips[i] === chip);
    }
    applyFilter();
  });

  /* Category circles + footer links trigger a filter */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-goto]");
    if (!t) return;
    var key = t.dataset.goto;
    var chip = document.querySelector('.chip[data-filter="' + key + '"]');
    if (chip) chip.click();
  });

  document.querySelectorAll(".footer [data-filter]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var chip = document.querySelector('.chip[data-filter="' + a.dataset.filter + '"]');
      if (chip) chip.click();
      var shop = document.getElementById("shop");
      if (shop) shop.scrollIntoView({ behavior: "smooth" });
    });
  });

  applyFilter();

  /* ---------- Size selector inside cards ---------- */
  var sizeRows = document.querySelectorAll(".size-row");
  for (var sr = 0; sr < sizeRows.length; sr++) {
    sizeRows[sr].addEventListener("click", function (e) {
      var pill = e.target.closest(".size-pill");
      if (!pill) return;
      var card = pill.closest(".card");
      if (!card) return;
      var pills = card.querySelectorAll(".size-pill");
      for (var pi = 0; pi < pills.length; pi++) {
        pills[pi].classList.toggle("active", pills[pi] === pill);
      }
      var add = card.querySelector(".add-btn");
      add.dataset.id = pill.dataset.variant;
      var priceEl = card.querySelector("[data-variant-price]");
      priceEl.innerHTML =
        "Rs. " + pill.dataset.price + " <small>&middot; " + pill.dataset.size + "</small>";
    });
  }

  /* ---------- Reveal on scroll (safe: hidden only while JS animates) ---------- */
  var useIO = "IntersectionObserver" in window;
  var io = null;

  function revealAll() {
    var els = document.querySelectorAll(".reveal:not(.in)");
    for (var i = 0; i < els.length; i++) els[i].classList.add("in");
  }

  if (useIO) {
    io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  function observeReveals() {
    if (!useIO) {
      revealAll();
      return;
    }
    var els = document.querySelectorAll(".reveal:not(.in)");
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }
  observeReveals();

  /* ---------- Cart ---------- */
  var STORAGE_KEY = "mukunda-cart";
  var cart = [];
  try {
    cart = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    cart = [];
  }

  var cartEl = document.getElementById("cart");
  var scrim = document.getElementById("scrim");
  var cartItemsEl = document.getElementById("cartItems");
  var cartCountEl = document.getElementById("cartCount");
  var subtotalEl = document.getElementById("cartSubtotal");
  var toastEl = document.getElementById("toast");

  function findInCart(id) {
    for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i];
    return null;
  }

  function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(id) {
    var item = findInCart(id);
    if (item) item.qty += 1;
    else cart.push({ id: id, qty: 1 });
    saveCart();
    showToast("Added to cart");
  }

  var toastTimer;
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 1900);
  }

  function thumbSVG(p) {
    var color = catColor(p.category);
    return (
      '<svg viewBox="0 0 48 48" aria-hidden="true">' +
        '<rect width="48" height="48" rx="9" fill="' + color + '" opacity="0.14"/>' +
        '<circle cx="24" cy="24" r="13" fill="' + color + '"/>' +
        '<path d="M24 16c4 4 6 7 6 11 0 4-2 6-6 6s-6-2-6-6c0-4 2-7 6-11Z" fill="#fff"/>' +
      "</svg>"
    );
  }

  function updateCartUI() {
    var count = 0;
    for (var i = 0; i < cart.length; i++) count += cart[i].qty;
    cartCountEl.textContent = count;

    if (cart.length === 0) {
      cartItemsEl.innerHTML =
        '<p class="cart__empty">Your cart is empty. Add a few herbs to get started.</p>';
      subtotalEl.textContent = "Rs. 0";
      return;
    }

    var total = 0;
    var html = "";
    for (var j = 0; j < cart.length; j++) {
      var item = cart[j];
      var p = PRODUCTS.find(function (x) { return x.id === item.id; });
      if (!p) continue;
      var line = p.price * item.qty;
      total += line;
      html +=
        '<div class="citem" data-id="' + p.id + '">' +
          '<div class="citem__art">' + thumbSVG(p) + "</div>" +
          "<div>" +
            '<div class="citem__name">' + p.name + "</div>" +
            '<div class="citem__meta">' + p.size + "</div>" +
            '<div class="citem__row">' +
              '<span class="citem__price">Rs. ' + p.price + "</span>" +
              '<span class="qty">' +
                '<button data-act="dec" data-id="' + p.id + '">&minus;</button>' +
                '<span>' + item.qty + "</span>" +
                '<button data-act="inc" data-id="' + p.id + '">+</button>' +
              "</span>" +
            "</div>" +
          "</div>" +
          '<button class="citem__remove" data-act="remove" data-id="' + p.id + '" aria-label="Remove">&#10005;</button>' +
        "</div>";
    }
    cartItemsEl.innerHTML = html;
    subtotalEl.textContent = "Rs. " + total;
  }

  document.addEventListener("click", function (e) {
    var add = e.target.closest(".add-btn");
    if (add) {
      addToCart(add.dataset.id);
      return;
    }
    var act = e.target.closest("[data-act]");
    if (!act) return;
    var id = act.dataset.id;
    var item = findInCart(id);
    if (!item) return;
    var action = act.dataset.act;
    if (action === "inc") item.qty += 1;
    if (action === "dec") {
      item.qty -= 1;
      if (item.qty <= 0) cart = cart.filter(function (c) { return c.id !== id; });
    }
    if (action === "remove") cart = cart.filter(function (c) { return c.id !== id; });
    saveCart();
  });

  function openCart() {
    cartEl.classList.add("open");
    scrim.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartEl.classList.remove("open");
    scrim.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.getElementById("cartBtn").addEventListener("click", openCart);
  var cartCloseBtns = document.querySelectorAll("[data-close-cart]");
  for (var b = 0; b < cartCloseBtns.length; b++) {
    cartCloseBtns[b].addEventListener("click", closeCart);
  }
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeCart();
  });

  /* ---------- WhatsApp checkout ---------- */
  var WHATSAPP_NUMBER = "919989918183";

  function buildOrderMessage() {
    var lines = cart
      .map(function (i) {
        var p = PRODUCTS.find(function (x) { return x.id === i.id; });
        return "- " + p.name + " (" + p.size + ") x " + i.qty + " = Rs. " + p.price * i.qty;
      })
      .join("\n");
    var total = cart.reduce(function (s, i) {
      var p = PRODUCTS.find(function (x) { return x.id === i.id; });
      return s + p.price * i.qty;
    }, 0);
    return encodeURIComponent(
      "Hello Mukunda Herbal! I would like to place an order.\n\n" +
        lines + "\n\nTotal: Rs. " + total +
        "\n\nPlease share the delivery details. Thank you!"
    );
  }

  var checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function () {
      if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
      }
      window.open(
        "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + buildOrderMessage(),
        "_blank"
      );
    });
  }

  var quickOrderBtns = document.querySelectorAll(".wa-order");
  for (var q = 0; q < quickOrderBtns.length; q++) {
    quickOrderBtns[q].addEventListener("click", function (e) {
      e.preventDefault();
      var id = e.currentTarget.dataset.id || "shampoo200";
      var p = PRODUCTS.find(function (x) { return x.id === id; });
      var msg = encodeURIComponent(
        "Hello Mukunda Herbal! I would like to order: " + p.name + " (" + p.size + ") Rs. " + p.price + "."
      );
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg, "_blank");
    });
  }

  /* ---------- Contact form via WhatsApp ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = contactForm.name.value.trim();
      var contact = contactForm.contact.value.trim();
      var message = contactForm.message.value.trim();
      var text = encodeURIComponent(
        "Hello Mukunda Herbal!\n\nName: " + name + "\nContact: " + contact + "\n\n" + message
      );
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + text, "_blank");
    });
  }

  /* ---------- Navigation toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  navToggle.addEventListener("click", function () {
    nav.classList.toggle("open");
    navToggle.classList.toggle("open");
  });
  var navLinks = nav.querySelectorAll("a");
  for (var n = 0; n < navLinks.length; n++) {
    navLinks[n].addEventListener("click", function () {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("header");
  window.addEventListener(
    "scroll",
    function () {
      header.style.boxShadow =
        window.scrollY > 10 ? "0 10px 30px -18px rgba(38,49,31,.25)" : "none";
    },
    { passive: true }
  );

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  updateCartUI();
})();
