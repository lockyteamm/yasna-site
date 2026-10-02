(() => {
  "use strict";

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });

  /* ---------- Filters ---------- */
  const chips = [...document.querySelectorAll(".chip")];
  const products = [...document.querySelectorAll(".product")];

  const applyFilter = (filter) => {
    chips.forEach((c) => c.classList.toggle("is-active", c.dataset.filter === filter));
    products.forEach((p) => {
      p.classList.toggle("is-hidden", filter !== "all" && p.dataset.cat !== filter);
    });
  };
  chips.forEach((c) => c.addEventListener("click", () => applyFilter(c.dataset.filter)));

  document.querySelectorAll("[data-filter]").forEach((el) => {
    if (el.classList.contains("chip")) return;
    el.addEventListener("click", () => applyFilter(el.dataset.filter));
  });

  /* ---------- Cart ---------- */
  const cart = [];
  const cartCount = document.getElementById("cartCount");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawerOverlay");
  const drawerItems = document.getElementById("drawerItems");
  const drawerTotal = document.getElementById("drawerTotal");
  const toast = document.getElementById("toast");
  let toastTimer;

  const fmt = (n) => n.toLocaleString("ru-RU") + " ₽";

  const renderCart = () => {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cartCount.textContent = cart.reduce((s, i) => s + i.qty, 0);
    drawerTotal.textContent = fmt(total);

    if (!cart.length) {
      drawerItems.innerHTML = '<p class="drawer__empty">Пока пусто — добавьте что-нибудь нежное.</p>';
      return;
    }
    drawerItems.innerHTML = cart.map((i, idx) => `
      <div class="cart-item">
        <img src="${i.img}" alt="">
        <div class="cart-item__info">
          <div class="cart-item__name">${i.name}</div>
          <div class="cart-item__price">${i.qty} × ${fmt(i.price)}</div>
        </div>
        <button class="cart-item__remove" data-idx="${idx}" aria-label="Удалить">×</button>
      </div>
    `).join("");
  };

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 2200);
  };

  const openDrawer = (open) => {
    drawer.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  document.getElementById("cartBtn").addEventListener("click", () => openDrawer(true));
  document.getElementById("drawerClose").addEventListener("click", () => openDrawer(false));
  overlay.addEventListener("click", () => openDrawer(false));
  document.addEventListener("keydown", (e) => e.key === "Escape" && openDrawer(false));

  drawerItems.addEventListener("click", (e) => {
    const btn = e.target.closest(".cart-item__remove");
    if (!btn) return;
    cart.splice(+btn.dataset.idx, 1);
    renderCart();
  });

  document.querySelectorAll(".product .add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".product");
      const item = {
        name: card.dataset.name,
        price: +card.dataset.price,
        img: card.dataset.img,
        qty: 1,
      };
      const existing = cart.find((i) => i.name === item.name);
      if (existing) existing.qty++;
      else cart.push(item);

      renderCart();
      cartCount.classList.remove("is-bump");
      void cartCount.offsetWidth;
      cartCount.classList.add("is-bump");
      showToast("Добавлено в корзину");
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-visible");
        observer.unobserve(en.target);
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
