(() => {
  "use strict";

  const SITE = window.SITE || {};
  const PRODUCTS = window.PRODUCTS || [];
  const PORTFOLIO = window.PORTFOLIO || [];
  const WHY = window.WHY || [];
  const FAQ = window.FAQ || [];
  const root = document.documentElement;
  const hasIntro = root.classList.contains("intro");

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- intro loader ---------- */
  if (hasIntro) {
    const loader = $("#loader");
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      loader.classList.add("done");
      setTimeout(() => root.classList.remove("intro"), 560);
      try { sessionStorage.setItem("armada-intro", "1"); } catch (e) {}
    };
    const fallback = setTimeout(done, 2400);
    window.addEventListener("load", () => { clearTimeout(fallback); setTimeout(done, 700); }, { once: true });
  }

  /* ---------- WhatsApp helpers ---------- */
  const waLink = (msg) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

  function bindLinks(root = document) {
    $$("[data-wa]", root).forEach((a) => {
      a.href = waLink(a.dataset.wa);
      a.target = "_blank";
      a.rel = "noopener";
    });
    $$("[data-ig]", root).forEach((a) => (a.href = SITE.instagram || "#"));
  }
  bindLinks();

  $$("[data-site]").forEach((el) => {
    const v = SITE[el.dataset.site];
    if (v) el.textContent = v;
    else el.closest("li")?.remove();
  });
  if (SITE.mapsUrl) {
    const addr = $('[data-site="address"]');
    if (addr) addr.outerHTML = `<a href="${esc(SITE.mapsUrl)}" target="_blank" rel="noopener">${esc(SITE.address)}</a>`;
  }
  $("#year").textContent = new Date().getFullYear();

  /* ---------- toast ---------- */
  const toastEl = $("#toast");
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove("is-show"), 2400);
  }

  /* ---------- image loader with placeholder fallback ---------- */
  const imgCache = {};
  function loadImage(src, container, alt, cb) {
    if (!src) return;
    const img = new Image();
    img.alt = alt || "";
    img.loading = "lazy";
    img.decoding = "async";
    img.onload = () => {
      imgCache[src] = true;
      container.classList.add("has-img");
      if (cb) cb();
    };
    img.onerror = () => {
      imgCache[src] = false;
      img.remove();
    };
    img.src = src;
    container.appendChild(img);
  }

  function placeholder(cat, icon, seed = 0) {
    if (window.ArmadaScene) {
      return `<div class="ph ph-scene" data-cat="${esc(cat)}">${window.ArmadaScene.render(cat, seed)}<span class="ph-tag">Ilustrasi</span></div>`;
    }
    return `<div class="ph" data-cat="${esc(cat)}">
      <span class="ph-word" aria-hidden="true">${esc(cat)}</span>
      <svg class="ph-icon" aria-hidden="true"><use href="#p-${icon}"/></svg>
      <span class="ph-tag">Foto menyusul</span>
    </div>`;
  }

  function productScene(p) {
    if (window.ArmadaScene && p.category) return window.ArmadaScene.render(p.category, PRODUCTS.indexOf(p) + 3);
    return `<svg aria-hidden="true"><use href="#p-${p.icon}"/></svg>`;
  }

  const catIcon = {
    "Neon Box": "box", "Huruf Timbul": "type", "Neon Flex": "spark", Billboard: "board",
    "Fasad ACP": "layers", Pylon: "pylon", Indoor: "door", Branding: "car",
  };

  /* ---------- marquee ---------- */
  const tri = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 4L98 96H2z" fill="#B5141D"/><path d="M50 4L61 68L2 96z" fill="#DA1C24"/><path d="M50 4L98 96L61 68z" fill="#8A0D16"/></svg>`;
  const mq = $("#marquee");
  const mqItem = (p, i, dup) =>
    `<button type="button" class="mq-item${dup ? " mq-dup" : ""}" data-p="${i}"${dup ? ' tabindex="-1" aria-hidden="true"' : ""}>${esc(p.name)} ${tri}</button>`;
  mq.innerHTML = PRODUCTS.map((p, i) => mqItem(p, i, false)).join("") + PRODUCTS.map((p, i) => mqItem(p, i, true)).join("");
  mq.addEventListener("click", (e) => {
    const b = e.target.closest(".mq-item");
    if (b) openSheet(+b.dataset.p);
  });

  /* ---------- hero rotator ---------- */
  const rot = $("#rotator");
  const words = PRODUCTS.map((p) => p.name);
  let wi = 0;
  if (rot && words.length && !reduced) {
    setInterval(() => {
      rot.classList.add("out");
      setTimeout(() => {
        wi = (wi + 1) % words.length;
        rot.textContent = words[wi];
        rot.classList.remove("out");
        rot.classList.add("in");
        requestAnimationFrame(() => requestAnimationFrame(() => rot.classList.remove("in")));
      }, 320);
    }, 2200);
  }

  /* ---------- neon sign ---------- */
  const sign = $("#sign");
  const sw = $("#signSwitch");
  const swLabel = $("#switchLabel");
  function setSign(on, flicker = true) {
    sign.classList.toggle("is-on", on);
    sw.setAttribute("aria-pressed", String(on));
    swLabel.textContent = on ? "Lampu ON" : "Lampu OFF";
    if (on && flicker && !reduced) {
      sign.classList.remove("is-flicker");
      void sign.offsetWidth;
      sign.classList.add("is-flicker");
    }
  }
  const NEON = [["#f5e400", "#fff9b8"], ["#ff3fd0", "#ffd9f6"], ["#22d3ff", "#d9f8ff"], ["#ff3b3b", "#ffe0e0"], ["#39ff88", "#dcffe9"], ["#ffffff", "#ffffff"]];
  let neonIdx = 0;
  const buzz = () => { if (navigator.vibrate && isMobile()) navigator.vibrate(12); };
  sw.addEventListener("click", () => { setSign(!sign.classList.contains("is-on")); buzz(); });
  const cycleNeon = () => {
    if (!sign.classList.contains("is-on")) { setSign(true); buzz(); return; }
    neonIdx = (neonIdx + 1) % NEON.length;
    sign.style.setProperty("--neon", NEON[neonIdx][0]);
    sign.style.setProperty("--neon-core", NEON[neonIdx][1]);
    setSign(true);
    buzz();
  };
  sign.addEventListener("click", cycleNeon);
  sign.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycleNeon(); } });
  // initial "power on" moment
  sign.classList.remove("is-on");
  setTimeout(() => setSign(true), hasIntro ? 1700 : 650);

  // tilt (pointer devices)
  if (window.matchMedia("(hover: hover)").matches && !reduced) {
    const wrap = sign.parentElement;
    wrap.addEventListener("pointermove", (e) => {
      const r = sign.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      sign.style.setProperty("--ry", `${x * 8}deg`);
      sign.style.setProperty("--rx", `${-y * 6}deg`);
      sign.style.setProperty("--px", x.toFixed(3));
      sign.style.setProperty("--py", y.toFixed(3));
    });
    wrap.addEventListener("pointerleave", () => {
      sign.style.setProperty("--ry", "0deg");
      sign.style.setProperty("--rx", "0deg");
      sign.style.setProperty("--px", "0");
      sign.style.setProperty("--py", "0");
    });
  }

  /* ---------- header, progress, active section ---------- */
  const header = $("#header");
  const bar = $("#progressBar");
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
    updateSteps();
    updateChrome(y);
    ticking = false;
  }
  function updateSteps() {
    const el = document.querySelector(".steps");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (innerHeight * 0.55)));
    el.style.setProperty("--p", p.toFixed(3));
    el.querySelectorAll(".step").forEach((st, k, all) => st.classList.toggle("is-lit", p >= (k + 0.6) / all.length));
  }
  window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  const sections = ["home", "karya", "produk", "simulasi", "kenapa", "proses", "faq", "kontak"].map((id) => document.getElementById(id));
  const navLinks = $$(".nav a");
  const tabLinks = $$(".tabbar a[data-tab]");
  const secObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const id = en.target.id;
        navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
        const tabId = { simulasi: "produk", kenapa: "produk", proses: "kontak", faq: "kontak" }[id] || id;
        tabLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.tab === tabId));
        document.querySelectorAll(".dots a").forEach((a) => a.classList.toggle("is-active", a.dataset.id === id));
        movePill();
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => s && secObs.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          revObs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  function observeReveal(root = document) {
    $$(".reveal", root).forEach((el) => {
      const sib = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("reveal")) : [];
      const idx = sib.indexOf(el);
      if (idx > 0) el.style.setProperty("--d", `${Math.min(idx, 6) * 0.07}s`);
      revObs.observe(el);
    });
  }

  /* =========================================================
     PORTFOLIO
     ========================================================= */
  const gallery = $("#gallery");
  const filters = $("#filters");
  const cats = [...new Set(PORTFOLIO.map((p) => p.category))];
  let activeCat = "Semua";
  let visibleList = PORTFOLIO.map((_, i) => i);

  filters.innerHTML = ["Semua", ...cats]
    .map((c) => {
      const n = c === "Semua" ? PORTFOLIO.length : PORTFOLIO.filter((p) => p.category === c).length;
      return `<button class="chip${c === "Semua" ? " is-active" : ""}" role="tab" aria-selected="${c === "Semua"}" data-cat="${esc(c)}">${esc(c)}<sup>${n}</sup></button>`;
    })
    .join("");

  gallery.innerHTML = PORTFOLIO.map(
    (p, i) => `<button data-cursor="Lihat" class="work reveal${p.featured ? " is-featured" : p.wide ? " is-wide" : ""}" data-i="${i}" data-cat="${esc(p.category)}" aria-label="Lihat ${esc(p.title)}">
      <div class="work-media">${placeholder(p.category, catIcon[p.category] || "box", i)}</div>
      <div class="work-info">
        <div><span class="work-cat">${esc(p.category)}${p.place ? " · " + esc(p.place) : ""}</span><span class="work-title">${esc(p.title)}</span></div>
        <span class="work-zoom"><svg class="i"><use href="#i-arrow"/></svg></span>
      </div>
    </button>`
  ).join("");
  $$(".work", gallery).forEach((el) => {
    const p = PORTFOLIO[+el.dataset.i];
    loadImage(p.image, $(".work-media", el), p.title);
  });

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn || btn.dataset.cat === activeCat) return;
    activeCat = btn.dataset.cat;
    $$(".chip", filters).forEach((c) => {
      const on = c === btn;
      c.classList.toggle("is-active", on);
      c.setAttribute("aria-selected", on);
    });
    const chipRow = btn.parentElement;
    chipRow.scrollTo({ left: btn.offsetLeft - (chipRow.clientWidth - btn.offsetWidth) / 2, behavior: "smooth" });
    galLimit = pageSize();
    applyFilter(true);
  });

  let galLimit = 0;
  const pageSize = () => (isMobile() ? 6 : 9);
  const moreBtn = $("#galMore");
  function applyFilter(animate) {
    if (!galLimit) galLimit = pageSize();
    visibleList = [];
    let shown = 0;
    $$(".work", gallery).forEach((el) => {
      const match = activeCat === "Semua" || el.dataset.cat === activeCat;
      const within = match && shown < galLimit;
      if (match) visibleList.push(+el.dataset.i);
      if (within) shown++;
      const wasHidden = el.classList.contains("is-hidden");
      el.classList.toggle("is-hidden", !within);
      if (within && (animate || wasHidden)) {
        el.classList.add("is-visible", "is-entering");
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("is-entering")));
      }
    });
    const left = visibleList.length - shown;
    moreBtn.hidden = left <= 0;
    moreBtn.firstElementChild.textContent = "Lihat " + left + " karya lainnya";
  }
  applyFilter(false);
  moreBtn.addEventListener("click", () => {
    galLimit += pageSize();
    applyFilter(false);
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox");
  const lbMedia = $("#lbMedia");
  let lbPos = 0;
  let lastFocus = null;

  function lockScroll(on) {
    document.documentElement.style.overflow = on ? "hidden" : "";
  }
  // make the page behind a modal unreachable for keyboard & screen readers
  const bgEls = ["header", "main", "footer", ".fab", "#tabbar"].map((q) => $(q)).filter(Boolean);
  function setInert(on) {
    bgEls.forEach((el) => {
      if (on) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
      else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
    });
  }
  function setHash(h) {
    try { history.replaceState(null, "", "#" + h); } catch (e) {}
  }
  function trapTab(e, box) {
    const f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', box).filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  async function shareLink(title, url = location.href) {
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      toast("Link disalin \u2713");
    } catch (e) {
      if (e && e.name !== "AbortError") toast("Gagal menyalin link");
    }
  }

  function renderLb(dir = 0) {
    const p = PORTFOLIO[visibleList[lbPos]];
    lbMedia.classList.remove("has-img", "swap");
    lbMedia.innerHTML = placeholder(p.category, catIcon[p.category] || "box", visibleList[lbPos]);
    const ba = $("#lbBA");
    lbMedia.classList.remove("show-before");
    ba.setAttribute("aria-pressed", "false");
    ba.lastElementChild.textContent = "Lihat sebelum";
    const beforeHTML = p.before
      ? `<img src="${esc(p.before)}" alt="Sebelum: ${esc(p.title)}" style="opacity:1">`
      : window.ArmadaScene ? window.ArmadaScene.render(p.category, visibleList[lbPos], { bare: true }) : "";
    if (beforeHTML) lbMedia.insertAdjacentHTML("beforeend", `<div class="lb-before">${beforeHTML}<span class="lb-ba-tag">Sebelum dipasang</span></div>`);
    ba.hidden = !beforeHTML || !(p.before || imgCache[p.image] !== true);
    if (imgCache[p.image] !== false) loadImage(p.image, lbMedia, p.title, () => {
      if (!p.before) { ba.hidden = true; lbMedia.classList.remove("show-before"); }
    });
    if (dir) {
      lbMedia.style.setProperty("--dir", `${dir * 30}px`);
      void lbMedia.offsetWidth;
      lbMedia.classList.add("swap");
    }
    $("#lbCat").textContent = p.category + (p.place ? " · " + p.place : "");
    $("#lbTitle").textContent = p.title;
    $("#lbWa").href = waLink(`Halo Armada Advertising, saya lihat portofolio "${p.title}" (${p.category}). Saya mau bikin yang seperti ini, bisa minta info harga?`);
    $("#lbCount").textContent = `${lbPos + 1} / ${visibleList.length}`;
    if (lb.classList.contains("is-open")) setHash("karya/" + (visibleList[lbPos] + 1));
    if (lb.classList.contains("is-story")) storySync();
  }

  /* stories (mobile): auto-advance, tap left/right, hold to pause */
  const STORY = 5000;
  let storyT = null, storyStart = 0, storyLeft = STORY;
  const lbBars = $("#lbBars");
  lbBars.style.setProperty("--story", STORY / 1000 + "s");
  function storyStep(d) {
    if (d > 0 && lbPos >= visibleList.length - 1) return closeLb();
    if (d < 0 && lbPos <= 0) return storySync();
    stepLb(d);
  }
  function storyPlay() {
    clearTimeout(storyT);
    storyStart = performance.now();
    storyT = setTimeout(() => storyStep(1), storyLeft);
  }
  function storySync() {
    if (lbBars.children.length !== visibleList.length) lbBars.innerHTML = visibleList.map(() => "<i></i>").join("");
    [...lbBars.children].forEach((b, k) => (b.className = k < lbPos ? "done" : ""));
    const cur = lbBars.children[lbPos];
    void cur.offsetWidth;
    cur.className = "on";
    lb.classList.remove("is-paused");
    storyLeft = STORY;
    storyPlay();
  }
  function storyPause() {
    clearTimeout(storyT);
    storyLeft = Math.max(300, storyLeft - (performance.now() - storyStart));
    lb.classList.add("is-paused");
  }
  function storyResume() {
    lb.classList.remove("is-paused");
    storyPlay();
  }
  document.addEventListener("visibilitychange", () => {
    if (!lb.classList.contains("is-story") || !lb.classList.contains("is-open")) return;
    document.hidden ? storyPause() : storyResume();
  });
  function openLb(i) {
    lastFocus = document.activeElement;
    if (visibleList.indexOf(i) < 0) visibleList = PORTFOLIO.map((_, k) => k);
    lbPos = visibleList.indexOf(i);
    lb.classList.toggle("is-story", isMobile() && !reduced);
    lb.classList.remove("is-paused");
    renderLb();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setInert(true);
    setHash("karya/" + (visibleList[lbPos] + 1));
    $(".lb-close", lb).focus({ preventScroll: true });
  }
  function closeLb() {
    lb.classList.remove("is-open");
    clearTimeout(storyT);
    lb.setAttribute("aria-hidden", "true");
    lockScroll(false);
    setInert(false);
    setHash("karya");
    lastFocus?.focus({ preventScroll: true });
  }
  const stepLb = (d) => {
    lbPos = (lbPos + d + visibleList.length) % visibleList.length;
    renderLb(d);
  };

  gallery.addEventListener("click", (e) => {
    const w = e.target.closest(".work");
    if (w) openLb(+w.dataset.i);
  });
  $("#lbPrev").addEventListener("click", () => stepLb(-1));
  $("#lbNext").addEventListener("click", () => stepLb(1));
  $("#lbShare").addEventListener("click", () => shareLink(PORTFOLIO[visibleList[lbPos]].title + " \u2014 CV Armada Advertising"));
  $("[data-lb-close]", lb).addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });

  // swipe / tap / hold in lightbox
  let sx = 0, sy = 0, holdT = null, held = false;
  const lbFig = $("#lbFigure");
  const isStory = () => lb.classList.contains("is-story");
  lbFig.addEventListener("touchstart", (e) => {
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; held = false;
    clearTimeout(holdT);
    if (isStory() && !e.target.closest("a, button")) holdT = setTimeout(() => { held = true; storyPause(); }, 230);
  }, { passive: true });
  lbFig.addEventListener("touchmove", (e) => {
    if (Math.abs(e.touches[0].clientX - sx) > 10 || Math.abs(e.touches[0].clientY - sy) > 10) clearTimeout(holdT);
  }, { passive: true });
  lbFig.addEventListener("touchend", (e) => {
    clearTimeout(holdT);
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (held) { held = false; storyResume(); return; }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) isStory() ? storyStep(dx < 0 ? 1 : -1) : stepLb(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) closeLb();
    else if (isStory() && Math.abs(dx) < 10 && Math.abs(dy) < 10 && !e.target.closest("a, button")) {
      const r = lbFig.getBoundingClientRect();
      storyStep(e.changedTouches[0].clientX < r.left + r.width * 0.33 ? -1 : 1);
    }
  });

  /* =========================================================
     PRODUCTS
     ========================================================= */
  const productsEl = $("#products");
  productsEl.innerHTML = PRODUCTS.map(
    (p, i) => `<button data-cursor="Detail" class="product reveal" data-i="${i}" aria-label="Detail ${esc(p.name)}">
      <div class="product-visual">
        <span class="product-no">${String(i + 1).padStart(2, "0")}</span>
        ${p.badge ? `<span class="product-badge">${esc(p.badge)}</span>` : ""}
        ${productScene(p)}
      </div>
      <div class="product-body">
        <div><span class="product-name">${esc(p.name)}</span><span class="product-tag">${esc(p.tagline)}</span>${p.startPrice ? `<span class="product-price">Mulai ${esc(p.startPrice)}</span>` : ""}</div>
        <span class="product-plus" aria-hidden="true"><svg class="i"><use href="#i-arrow"/></svg></span>
      </div>
    </button>`
  ).join("");
  $$(".product", productsEl).forEach((el) => {
    const p = PRODUCTS[+el.dataset.i];
    loadImage(p.image, $(".product-visual", el), p.name);
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- product sheet ---------- */
  const sheet = $("#sheet");
  const sheetPanel = $("#sheetPanel");
  const sheetBody = $("#sheetBody");
  let curProduct = 0;
  const cmpList = [];
  let sheetMode = "product";

  function renderSheet(i) {
    sheetMode = "product";
    curProduct = (i + PRODUCTS.length) % PRODUCTS.length;
    const p = PRODUCTS[curProduct];
    sheetBody.innerHTML = `<div class="pd">
      <div class="product-visual pd-visual" id="pdVisual">
        ${productScene(p)}
      </div>
      <div class="pd-info">
        <p class="pd-tagline">${esc(p.tagline)}</p>
        <h3 class="pd-name" id="sheetTitle">${esc(p.name)}</h3>
        <p class="pd-desc">${esc(p.desc)}</p>
        <dl class="pd-specs">${p.specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        <div class="pd-uses">${p.uses.map((u) => `<span>${esc(u)}</span>`).join("")}</div>
        ${(() => {
          const rel = PORTFOLIO.map((w, k) => [w, k]).filter(([w]) => p.category && w.category === p.category).slice(0, 6);
          if (!rel.length) return "";
          return `<div class="pd-rel"><p class="sim-label">Karya ${esc(p.name)} kami</p><div class="pd-rel-row">${rel
            .map(([w, k]) => `<button class="pd-rel-item" data-work="${k}" aria-label="Lihat ${esc(w.title)}">${placeholder(w.category, catIcon[w.category] || "box", k)}</button>`)
            .join("")}</div></div>`;
        })()}
        <div class="pd-price">${p.startPrice ? `<span>Harga mulai</span><b>${esc(p.startPrice)}</b>` : `<span>Harga</span><b>Sesuai ukuran &amp; bahan</b>`}<small>Hitung gratis via WhatsApp</small></div>
        <div class="pd-actions">
          <a class="btn btn-dark btn-lg" data-wa="Halo Armada Advertising, saya tertarik dengan produk ${esc(p.name)}. Boleh minta info harga & pilihan bahannya?" href="#">
            <svg class="i"><use href="#i-wa"/></svg> Tanya Harga
          </a>
          <div class="pd-nav">
            <button class="icon-btn" data-cmp aria-pressed="${cmpList.includes(curProduct)}" aria-label="Tambah ke perbandingan"><svg class="i"><use href="#i-compare"/></svg></button>
            <button class="icon-btn" data-share aria-label="Bagikan produk ini"><svg class="i"><use href="#i-share"/></svg></button>
            <button class="icon-btn" data-step="-1" aria-label="Produk sebelumnya"><svg class="i"><use href="#i-left"/></svg></button>
            <button class="icon-btn" data-step="1" aria-label="Produk berikutnya"><svg class="i"><use href="#i-arrow"/></svg></button>
          </div>
        </div>
      </div>
    </div>`;
    bindLinks(sheetBody);
    loadImage(p.image, $("#pdVisual"), p.name);
    $$(".pd-rel-item", sheetBody).forEach((el) => { const w = PORTFOLIO[+el.dataset.work]; loadImage(w.image, el, w.title); });
    sheetPanel.scrollTop = 0;
    if (sheet.classList.contains("is-open")) setHash("produk/" + p.id);
  }

  function openSheet(i) {
    lastFocus = document.activeElement;
    renderSheet(i);
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setInert(true);
    setHash("produk/" + PRODUCTS[curProduct].id);
    $(".sheet-close", sheet).focus({ preventScroll: true });
  }
  function closeSheet() {
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    sheetPanel.style.transform = "";
    lockScroll(false);
    setInert(false);
    setHash("produk");
    lastFocus?.focus({ preventScroll: true });
  }

  productsEl.addEventListener("click", (e) => {
    const c = e.target.closest(".product");
    if (c) openSheet(+c.dataset.i);
  });
  sheet.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeSheet();
    const s = e.target.closest("[data-step]");
    if (s) renderSheet(curProduct + +s.dataset.step);
    if (e.target.closest("[data-share]")) shareLink(PRODUCTS[curProduct].name + " \u2014 CV Armada Advertising");
  });

  // drag-to-close (mobile bottom sheet)
  let dragY = 0, dragging = false, startY = 0;
  function dragStart(e) {
    if (!isMobile()) return;
    if (sheetPanel.scrollTop > 0 && !e.target.closest("#sheetHandle")) return;
    dragging = true;
    startY = e.touches[0].clientY;
    dragY = 0;
  }
  function dragMove(e) {
    if (!dragging) return;
    dragY = Math.max(0, e.touches[0].clientY - startY);
    if (dragY > 0) {
      sheetPanel.classList.add("is-dragging");
      sheetPanel.style.transform = `translateY(${dragY}px)`;
    }
  }
  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    sheetPanel.classList.remove("is-dragging");
    if (dragY > 110) closeSheet();
    else sheetPanel.style.transform = "";
  }
  sheetPanel.addEventListener("touchstart", dragStart, { passive: true });
  sheetPanel.addEventListener("touchmove", dragMove, { passive: true });
  sheetPanel.addEventListener("touchend", dragEnd);

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (lb.classList.contains("is-open")) trapTab(e, lb);
      else if (sheet.classList.contains("is-open")) trapTab(e, sheetPanel);
      return;
    }
    if (lb.classList.contains("is-open")) {
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") stepLb(1);
      if (e.key === "ArrowLeft") stepLb(-1);
    } else if (sheet.classList.contains("is-open")) {
      if (e.key === "Escape") closeSheet();
      if (e.key === "ArrowRight" && sheetMode === "product") renderSheet(curProduct + 1);
      if (e.key === "ArrowLeft" && sheetMode === "product") renderSheet(curProduct - 1);
    }
  });

  /* =========================================================
     ORDER BUILDER
     ========================================================= */
  const orderChips = $("#orderChips");
  const chosen = new Set();
  orderChips.innerHTML = [...PRODUCTS.map((p) => p.name), "Lainnya"]
    .map((n) => `<button type="button" class="chip" aria-pressed="false" data-name="${esc(n)}">${esc(n)}</button>`)
    .join("");
  orderChips.addEventListener("click", (e) => {
    const c = e.target.closest(".chip");
    if (!c) return;
    const n = c.dataset.name;
    chosen.has(n) ? chosen.delete(n) : chosen.add(n);
    c.classList.toggle("is-active", chosen.has(n));
    c.setAttribute("aria-pressed", chosen.has(n));
  });

  const form = $("#orderForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!chosen.size) {
      form.classList.remove("shake");
      void form.offsetWidth;
      form.classList.add("shake");
      toast("Pilih minimal 1 produk dulu ya");
      return;
    }
    const name = $("#fName").value.trim();
    const note = $("#fNote").value.trim();
    const lines = ["Halo Armada Advertising 👋"];
    if (name) lines.push(`Saya ${name}.`);
    lines.push(`Saya mau pesan: *${[...chosen].join(", ")}*`);
    if (note) lines.push(`Ukuran / lokasi: ${note}`);
    lines.push("", "Mohon info harga & estimasi pengerjaannya. Terima kasih!");
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
  });

  /* =========================================================
     SIMULATOR SIGNAGE (siang / malam)
     ========================================================= */
  const SIM = {
    type: [["gold", "Huruf Timbul Gold"], ["silver", "Stainless Silver"], ["akrilik", "Akrilik Menyala"], ["neon", "Neon Flex"], ["box", "Neon Box"]],
    font: [["modern", "Modern"], ["elegan", "Elegan"], ["script", "Script"]],
    color: [["#ffe600", "Kuning"], ["#ffffff", "Putih"], ["#ff2a3a", "Merah"], ["#ff4fd8", "Pink"], ["#3ab4ff", "Biru"], ["#39ff88", "Hijau"]],
    wall: [["bata", "Bata"], ["beton", "Beton"], ["kayu", "Kayu"], ["acp", "ACP Hitam"]],
  };
  const darkText = { "#ff2a3a": true, "#3ab4ff": true };
  let applySim = null;
  let simApi = null;
  const stage = $("#simStage");
  if (stage) {
    const simText = $("#simText");
    const simWa = $("#simWa");
    const signs = $$("[data-role=sign]", stage);
    const st = { text: "TOKO ANDA", type: "gold", font: "modern", color: "#ffe600", wall: "bata", dist: 20 };
    try {
      const saved = JSON.parse(localStorage.getItem("armada-sim") || "{}");
      Object.keys(SIM).forEach((k) => { if (SIM[k].some(([v]) => v === saved[k])) st[k] = saved[k]; });
      if (typeof saved.text === "string" && saved.text.trim()) st.text = saved.text.slice(0, 20);
      if (saved.dist >= 3 && saved.dist <= 100) st.dist = Math.round(saved.dist);
    } catch (e) {}
    simText.value = st.text;

    const labelOf = (k, v) => (SIM[k].find(([x]) => x === v) || [, v])[1];
    const simDist = $("#simDist");

    // Rule of thumb: 1 inch letter height per 10 ft viewing distance (~0.83 cm per metre)
    function calcSize(text) {
      const h = Math.max(10, Math.round((st.dist * 0.83) / 5) * 5);
      const len = [...text].reduce((a, ch) => a + (ch === " " ? 0.4 : 1), 0);
      const factor = { modern: 0.78, elegan: 0.7, script: 0.62 }[st.font] || 0.75;
      let w = (len * h * factor) / 100;
      if (st.type === "box") w = w * 1.2 + 0.2;
      return { h, w: Math.max(0.3, Math.round(w * 10) / 10) };
    }
    function simUrl() {
      const q = new URLSearchParams({ t: st.text.trim() || "TOKO ANDA", ty: st.type, f: st.font, c: st.color.slice(1), w: st.wall, d: String(st.dist) });
      return location.origin + location.pathname + "#sim?" + q.toString();
    }

    $$(".sim-opts", stage.parentElement).forEach((box) => {
      const key = box.dataset.key;
      box.innerHTML = SIM[key]
        .map(([v, label]) =>
          key === "color"
            ? '<button type="button" class="swatch" style="--c:' + v + '" data-v="' + v + '" aria-label="' + label + '" aria-pressed="false"></button>'
            : '<button type="button" class="chip" data-v="' + v + '" aria-pressed="false">' + esc(label) + "</button>"
        )
        .join("");
      box.addEventListener("click", (e) => {
        const b = e.target.closest("[data-v]");
        if (!b) return;
        st[key] = b.dataset.v;
        renderSim();
        b.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
      });
    });

    function fit() {
      const W = stage.clientWidth, H = stage.clientHeight;
      if (!W) return;
      const base = H * (st.type === "box" ? 0.2 : 0.26);
      stage.style.setProperty("--fs", base + "px");
      const el = signs[0].firstElementChild;
      const w = el.offsetWidth;
      const max = W * 0.84;
      stage.style.setProperty("--fs", (w > max ? base * (max / w) : base) + "px");
    }

    function renderSim() {
      const text = st.text.trim() || "TOKO ANDA";
      stage.dataset.type = st.type;
      stage.dataset.font = st.font;
      stage.dataset.wall = st.wall;
      stage.style.setProperty("--c", st.color);
      stage.style.setProperty("--tc", darkText[st.color] ? "#ffffff" : "#141012");
      const inner = '<span class="sim-text">' + esc(text) + "</span>";
      signs.forEach((s) => (s.innerHTML = st.type === "box" ? '<div class="sim-box">' + inner + "</div>" : inner));
      $$(".sim-opts", stage.parentElement).forEach((box) => {
        $$("[data-v]", box).forEach((b) => {
          const on = b.dataset.v === st[box.dataset.key];
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-pressed", String(on));
        });
      });
      $("#simColorName").textContent = "· " + labelOf("color", st.color);
      const pb = $("#simPhotoBtn");
      if (pb) pb.classList.toggle("is-active", st.wall === "foto");
      fit();
      const size = calcSize(text);
      simDist.value = st.dist;
      simDist.style.setProperty("--fill", ((st.dist - 3) / 97) * 100 + "%");
      $("#simDistVal").textContent = st.dist + " m";
      $("#simH").textContent = "±" + size.h + " cm";
      $("#simW").textContent = "±" + String(size.w).replace(".", ",") + " m";
      const msg = [
        "Halo Armada Advertising, saya sudah coba simulasi signage di website:",
        "",
        "Nama/tulisan: *" + text + "*",
        "Jenis: " + labelOf("type", st.type),
        "Gaya huruf: " + labelOf("font", st.font),
        "Warna lampu: " + labelOf("color", st.color),
        "Dinding: " + (st.wall === "foto" ? "Foto toko sendiri (fotonya saya kirim di chat ini)" : labelOf("wall", st.wall)),
        "Jarak pandang: " + st.dist + " m (tinggi huruf \u00b1" + size.h + " cm, lebar \u00b1" + String(size.w).replace(".", ",") + " m)",
        /^https?:$/.test(location.protocol) ? "Link desain: " + simUrl() : "",
        "",
        "Mohon info harga & ukuran yang cocok. Terima kasih!",
      ].filter((l, k, a) => l !== "" || a[k - 1] !== "").join("\n");
      simWa.href = waLink(msg);
      try { localStorage.setItem("armada-sim", JSON.stringify(st)); } catch (e) {}
    }

    simText.addEventListener("input", () => { st.text = simText.value; renderSim(); });
    simDist.addEventListener("input", () => { st.dist = +simDist.value; renderSim(); });
    $("#simShare").addEventListener("click", () => shareLink("Desain signage saya \u2014 CV Armada Advertising", simUrl()));
    applySim = (q) => {
      const map = { ty: "type", f: "font", w: "wall" };
      Object.entries(map).forEach(([k, key]) => { const v = q.get(k); if (SIM[key].some(([x]) => x === v)) st[key] = v; });
      const c = "#" + (q.get("c") || "");
      if (SIM.color.some(([x]) => x === c)) st.color = c;
      const t = q.get("t");
      if (t) { st.text = t.slice(0, 20); simText.value = st.text; }
      const d = +q.get("d");
      if (d >= 3 && d <= 100) st.dist = Math.round(d);
      renderSim();
    };
    renderSim();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(stage);

    // split slider
    const handle = $("#simHandle");
    let split = 50, dragging = false, touched = false;
    const setSplit = (v) => {
      split = Math.max(0, Math.min(100, v));
      stage.style.setProperty("--split", split + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(split)));
    };
    const fromEvent = (e) => {
      const r = stage.getBoundingClientRect();
      setSplit(((e.clientX - r.left) / r.width) * 100);
    };
    const pos = { x: 0, y: 0, s: 1 };
    const setPos = (x, y) => {
      const W = stage.clientWidth / 2, H = stage.clientHeight / 2;
      pos.x = Math.max(-W, Math.min(W, x));
      pos.y = Math.max(-H, Math.min(H, y));
      stage.style.setProperty("--sx", pos.x.toFixed(1) + "px");
      stage.style.setProperty("--sy", pos.y.toFixed(1) + "px");
    };
    const setScale = (v) => {
      pos.s = Math.max(0.4, Math.min(1.8, v));
      stage.style.setProperty("--ss", pos.s.toFixed(2));
    };
    $(".sim-tools", stage).addEventListener("click", (e) => {
      const t = e.target.closest("[data-tool]");
      if (!t) return;
      if (t.dataset.tool === "bigger") setScale(pos.s + 0.15);
      else if (t.dataset.tool === "smaller") setScale(pos.s - 0.15);
      else { setPos(0, 0); setScale(1); }
    });
    let signDrag = null;
    stage.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".sim-tools")) return;
      touched = true;
      try { stage.setPointerCapture(e.pointerId); } catch (err) {}
      if (e.target.closest(".sim-sign > *")) {
        signDrag = { x: e.clientX, y: e.clientY, sx: pos.x, sy: pos.y };
        stage.classList.add("is-moving");
        return;
      }
      dragging = true;
      stage.classList.add("is-dragging");
      fromEvent(e);
    });
    stage.addEventListener("pointermove", (e) => {
      if (signDrag) { setPos(signDrag.sx + e.clientX - signDrag.x, signDrag.sy + e.clientY - signDrag.y); return; }
      if (dragging) fromEvent(e);
    });
    const stop = () => { dragging = false; signDrag = null; stage.classList.remove("is-dragging", "is-moving"); };
    simApi = { st, renderSim, setPos, setScale };
    stage.addEventListener("pointerup", stop);
    stage.addEventListener("pointercancel", stop);
    handle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        touched = true;
        setSplit(split + (e.key === "ArrowLeft" ? -5 : 5));
      }
    });

    // one-time hint sweep when it comes into view
    if (!reduced) {
      const hintObs = new IntersectionObserver((en) => {
        if (!en[0].isIntersecting) return;
        hintObs.disconnect();
        const keys = [50, 18, 82, 50];
        const t0 = performance.now(), dur = 2200;
        const tick = (t) => {
          if (touched) return;
          const k = Math.min(1, (t - t0) / dur);
          const seg = Math.min(keys.length - 2, Math.floor(k * (keys.length - 1)));
          const local = k * (keys.length - 1) - seg;
          const ease = 0.5 - Math.cos(local * Math.PI) / 2;
          setSplit(keys[seg] + (keys[seg + 1] - keys[seg]) * ease);
          if (k < 1) requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 500);
      }, { threshold: 0.5 });
      hintObs.observe(stage);
    }
  }

  /* =========================================================
     WHY + FAQ
     ========================================================= */
  const whyEl = $("#why");
  if (whyEl) {
    whyEl.innerHTML = WHY.map((w) =>
      '<article class="why-card reveal"><svg class="why-ic" aria-hidden="true"><use href="#i-' + esc(w.icon) + '"/></svg>' +
      "<div><h3>" + esc(w.title) + "</h3><p>" + esc(w.text) + "</p></div></article>"
    ).join("");
  }

  const faqEl = $("#faqList");
  if (faqEl) {
    faqEl.innerHTML = FAQ.map((f, i) =>
      '<div class="faq-item reveal' + (i === 0 ? " is-open" : "") + '">' +
      '<button class="faq-q" id="faq-q' + i + '" aria-expanded="' + (i === 0) + '" aria-controls="faq-a' + i + '">' +
      "<span>" + esc(f.q) + '</span><span class="faq-plus" aria-hidden="true"><svg class="i"><use href="#i-plus"/></svg></span></button>' +
      '<div class="faq-a" id="faq-a' + i + '" role="region" aria-labelledby="faq-q' + i + '"><div><p>' + esc(f.a) + "</p></div></div></div>"
    ).join("");
    faqEl.addEventListener("click", (e) => {
      const q = e.target.closest(".faq-q");
      if (!q) return;
      const item = q.parentElement;
      const open = !item.classList.contains("is-open");
      $$(".faq-item", faqEl).forEach((it) => {
        it.classList.remove("is-open");
        $(".faq-q", it).setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      q.setAttribute("aria-expanded", String(open));
    });
  }

  /* =========================================================
     SEO: structured data (LocalBusiness + FAQ)
     ========================================================= */
  try {
    const pageUrl = location.origin + location.pathname;
    const ld = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          name: "CV Armada Advertising",
          description: "Produksi neon box, huruf timbul, neon flex, billboard, pylon sign, fasad ACP & branding.",
          url: pageUrl,
          image: new URL("assets/img/og-image.jpg", location.href).href,
          telephone: "+" + SITE.whatsapp,
          address: SITE.address,
          sameAs: [SITE.instagram].filter(Boolean),
          makesOffer: PRODUCTS.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: p.name, description: p.desc } })),
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        },
      ],
    };
    const sc = document.createElement("script");
    sc.type = "application/ld+json";
    sc.textContent = JSON.stringify(ld);
    document.head.appendChild(sc);
  } catch (e) {}

  /* ---------- magnetic buttons (desktop) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    $$(".hero .btn-yellow, .header-cta, #simWa, .order .btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + "px " + ((e.clientY - r.top - r.height / 2) * 0.22).toFixed(1) + "px";
      });
      b.addEventListener("pointerleave", () => (b.style.translate = ""));
    });
  }

  /* =========================================================
     PRODUCT FINDER (quiz)
     ========================================================= */
  const QUIZ = [
    { key: "place", kick: "Lokasi", q: "Mau dipasang di mana?", opts: [
      ["outdoor", "🏪", "Luar ruangan", "Fasad toko, gedung, pinggir jalan"],
      ["indoor", "🛋️", "Dalam ruangan", "Lobby, kafe, kamar, kantor"],
      ["vehicle", "🚚", "Kendaraan / kaca", "Mobil, etalase, jendela toko"],
    ] },
    { key: "lit", kick: "Lampu", q: "Perlu menyala di malam hari?", opts: [
      ["lit", "💡", "Ya, harus menyala", "Tetap terlihat jelas saat malam"],
      ["unlit", "☀️", "Tidak perlu", "Cukup terlihat di siang hari"],
    ] },
    { key: "vibe", kick: "Kesan", q: "Kesan seperti apa yang kamu cari?", opts: [
      ["premium", "✨", "Premium & elegan", "Berkelas, rapi, mewah"],
      ["bright", "🔆", "Terang & mencolok", "Langsung menarik perhatian"],
      ["aesthetic", "📸", "Estetik & kekinian", "Instagramable, buat konten"],
      ["wide", "📢", "Besar & jangkauan luas", "Terlihat dari jauh"],
    ] },
  ];
  const SCORE = {
    "neon-box": { outdoor: 2, indoor: 1, lit: 2.5, bright: 3, wide: 1 },
    "huruf-timbul": { outdoor: 2, indoor: 1.5, lit: 1.5, unlit: 1.5, premium: 3 },
    "neon-flex": { indoor: 3, outdoor: 0.5, lit: 2.5, aesthetic: 3.5, bright: 1 },
    billboard: { outdoor: 2, lit: 1, unlit: 1.5, wide: 3.5, bright: 1 },
    pylon: { outdoor: 2, lit: 1.5, wide: 2.5, premium: 1 },
    "acp-fasad": { outdoor: 2, unlit: 1, premium: 2 },
    indoor: { indoor: 3, unlit: 1.5, premium: 1.5, aesthetic: 0.5 },
    branding: { vehicle: 6, unlit: 1, bright: 1.5, wide: 1.5 },
  };
  let quizAns = {};

  function renderQuiz(step) {
    sheetMode = "quiz";
    const total = QUIZ.length;
    const bars = QUIZ.map((_, k) => '<i class="' + (k <= step ? "on" : "") + '"></i>').join("");
    const top =
      '<div class="quiz-top">' +
      '<button class="quiz-back" data-quiz-back="' + (step - 1) + '" aria-label="Kembali"' + (step > 0 ? "" : " hidden") + '><svg class="i"><use href="#i-left"/></svg></button>' +
      '<div class="quiz-steps">' + bars + "</div>" +
      '<span class="quiz-count">' + Math.min(step + 1, total) + "/" + total + "</span></div>";

    if (step < total) {
      const Q = QUIZ[step];
      sheetBody.innerHTML =
        '<div class="quiz">' + top +
        '<div class="quiz-anim"><p class="quiz-kick">' + esc(Q.kick) + '</p><h3 class="quiz-q" id="sheetTitle">' + esc(Q.q) + "</h3>" +
        '<div class="quiz-opts">' +
        Q.opts.map(([v, em, label, sub]) =>
          '<button class="quiz-opt' + (quizAns[Q.key] === v ? " is-picked" : "") + '" data-quiz-pick="' + step + '" data-v="' + v + '">' +
          '<span class="quiz-em" aria-hidden="true">' + em + "</span><span><b>" + esc(label) + "</b><small>" + esc(sub) + "</small></span></button>"
        ).join("") +
        "</div></div></div>";
    } else {
      const ranked = PRODUCTS.map((p, i) => {
        const sc = SCORE[p.id] || {};
        return { i, s: Object.values(quizAns).reduce((a, v) => a + (sc[v] || 0), 0) };
      }).sort((a, b) => b.s - a.s).slice(0, 2);
      const ansText = QUIZ.map((Q) => (Q.opts.find((o) => o[0] === quizAns[Q.key]) || [])[2]).filter(Boolean).join(", ");
      sheetBody.innerHTML =
        '<div class="quiz">' + top.replace('data-quiz-back="' + (step - 1) + '"', 'data-quiz-back="' + (total - 1) + '"') +
        '<div class="quiz-anim"><p class="quiz-kick">Rekomendasi untukmu</p><h3 class="quiz-q" id="sheetTitle">Ini yang paling cocok.</h3>' +
        '<div class="quiz-res">' +
        ranked.map(({ i }, k) => {
          const p = PRODUCTS[i];
          return '<article class="quiz-card">' + (k === 0 ? '<span class="quiz-badge">★ Paling cocok</span>' : "") +
            '<div class="product-visual">' + productScene(p) + "</div>" +
            '<div class="quiz-card-body"><div><h4>' + esc(p.name) + "</h4><p>" + esc(p.tagline) + "</p></div>" +
            '<div class="quiz-card-actions"><button class="btn btn-soft" data-detail="' + i + '">Detail</button>' +
            '<a class="btn btn-dark" data-wa="Halo Armada Advertising, saya isi kuis di website (' + esc(ansText) + ") dan direkomendasikan " + esc(p.name) + '. Boleh minta info harganya?" href="#"><svg class="i"><use href="#i-wa"/></svg> Tanya</a></div>' +
            "</div></article>";
        }).join("") +
        '</div><div class="quiz-foot"><button class="quiz-again" data-quiz-restart><svg class="i"><use href="#i-refresh"/></svg> Ulangi kuis</button></div></div></div>';
      bindLinks(sheetBody);
    }
    sheetPanel.scrollTop = 0;
  }

  function openQuiz() {
    lastFocus = document.activeElement;
    quizAns = {};
    renderQuiz(0);
    sheet.classList.add("is-open");
    sheet.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setInert(true);
    setHash("produk/cari");
    $(".sheet-close", sheet).focus({ preventScroll: true });
  }
  $("#finderOpen")?.addEventListener("click", openQuiz);

  sheet.addEventListener("click", (e) => {
    const pick = e.target.closest("[data-quiz-pick]");
    if (pick) {
      const step = +pick.dataset.quizPick;
      quizAns[QUIZ[step].key] = pick.dataset.v;
      pick.classList.add("is-picked");
      if (navigator.vibrate && isMobile()) navigator.vibrate(8);
      setTimeout(() => renderQuiz(step + 1), 180);
      return;
    }
    const back = e.target.closest("[data-quiz-back]");
    if (back) return renderQuiz(Math.max(0, +back.dataset.quizBack));
    if (e.target.closest("[data-quiz-restart]")) { quizAns = {}; return renderQuiz(0); }
    const det = e.target.closest("[data-detail]");
    if (det) { renderSheet(+det.dataset.detail); setHash("produk/" + PRODUCTS[curProduct].id); }
    const rel = e.target.closest("[data-work]");
    if (rel) {
      const wi = +rel.dataset.work;
      closeSheet();
      setTimeout(() => openLb(wi), 250);
    }
  });

  /* =========================================================
     OPEN / CLOSED STATUS
     ========================================================= */
  const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  function openStatus() {
    try {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: SITE.timezone || "Asia/Jakarta", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      const get = (t) => (parts.find((x) => x.type === t) || {}).value;
      const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
      const now = (+get("hour") % 24) * 60 + +get("minute");
      const toM = (s) => { const [h, m] = String(s).split(":"); return +h * 60 + +(m || 0); };
      const days = SITE.openDays || [1, 2, 3, 4, 5, 6];
      const o = toM(SITE.openTime || "08:00"), c = toM(SITE.closeTime || "17:00");
      const open = days.includes(wd) && now >= o && now < c;
      let next = "";
      if (!open) {
        for (let k = 0; k < 8; k++) {
          const d = (wd + k) % 7;
          if (days.includes(d) && (k > 0 || now < o)) {
            next = (k === 0 ? "hari ini" : k === 1 ? "besok" : DAYS_ID[d]) + " " + (SITE.openTime || "08:00").replace(":", ".");
            break;
          }
        }
      }
      return { open, next };
    } catch (e) { return null; }
  }
  const hoursLi = $('[data-site="hours"]')?.closest("li");
  let statusEl = null;
  if (hoursLi) {
    const li = document.createElement("li");
    li.className = "status-li";
    li.innerHTML = '<span class="status" id="statusBadge"><i></i><span></span></span>';
    hoursLi.parentElement.insertBefore(li, hoursLi.parentElement.firstChild);
    statusEl = $("#statusBadge");
  }
  const fabTip = $(".fab-tip");
  const orderHint = $(".order-hint");
  function paintStatus() {
    const st = openStatus();
    if (!st) return;
    if (statusEl) {
      statusEl.classList.toggle("is-open", st.open);
      statusEl.lastElementChild.textContent = st.open ? "Buka sekarang · siap melayani" : "Sedang tutup · buka " + st.next;
    }
    if (fabTip) fabTip.textContent = st.open ? "Online · Chat kami" : "Tinggalkan pesan";
    if (orderHint) orderHint.textContent = st.open ? "Kami sedang online · Konsultasi gratis" : "Pesan dibalas saat buka " + st.next + " · Konsultasi gratis";
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  /* =========================================================
     SPLIT HEADINGS (word reveal)
     ========================================================= */
  if (!reduced) {
    $$(".section-title").forEach((h) => {
      let wi = 0;
      [...h.childNodes].forEach((node) => {
        if (node.nodeType !== 3) return;
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = "w";
          w.innerHTML = '<span style="--wi:' + wi++ + '">' + esc(part) + "</span>";
          frag.appendChild(w);
        });
        node.replaceWith(frag);
      });
      h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    });
  }

  /* ---------- custom cursor label (desktop) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduced) {
    root.classList.add("has-cursor");
    const cur = $("#cursor"), lab = $("#cursorLabel");
    let x = 0, y = 0, cx = 0, cy = 0, raf = null;
    const loop = () => {
      cx += (x - cx) * 0.25;
      cy += (y - cy) * 0.25;
      cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.4 ? requestAnimationFrame(loop) : null;
    };
    document.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      const t = e.target.closest("[data-cursor]");
      if (t) {
        if (!cur.classList.contains("on")) { cx = x; cy = y; }
        lab.textContent = t.dataset.cursor;
        cur.classList.add("on");
      } else cur.classList.remove("on");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    document.addEventListener("pointerleave", () => cur.classList.remove("on"));
  }

  /* ---------- PWA: service worker (https / localhost only) ---------- */
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  /* =========================================================
     HERO CITY + CHROME (nav pill, dots, to-top, hide on scroll)
     ========================================================= */
  if (window.ArmadaScene) $("#heroCity").innerHTML = window.ArmadaScene.city(11);

  function movePill(target) {
    const nav = document.querySelector(".nav");
    const pill = nav && nav.querySelector(".nav-pill");
    if (!pill) return;
    const a = target || nav.querySelector("a.is-active");
    if (!a) { pill.style.opacity = "0"; return; }
    pill.style.opacity = "1";
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = "translateX(" + a.offsetLeft + "px)";
  }
  const navEl = $(".nav");
  if (navEl) {
    navEl.addEventListener("mouseover", (e) => { const a = e.target.closest("a"); if (a) movePill(a); });
    navEl.addEventListener("mouseleave", () => movePill());
    window.addEventListener("resize", () => movePill());
  }

  const toTop = $("#toTop");
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
  function updateChrome(y) {
    const last = updateChrome.last || 0;
    if (Math.abs(y - last) > 6) {
      document.body.classList.toggle("nav-hidden", y > last && y > 240 && !document.body.classList.contains("chat-open"));
      updateChrome.last = y;
    }
    const tt = document.getElementById("toTop");
    if (tt) tt.classList.toggle("is-show", y > 900);
  }

  /* =========================================================
     QUICK CHAT (WhatsApp)
     ========================================================= */
  const chat = $("#chat");
  const CHAT_OPTS = [
    ["💰", "Tanya harga", "Halo Armada Advertising, saya mau tanya harga signage. Rencananya untuk: "],
    ["📍", "Minta survei lokasi", "Halo Armada Advertising, saya mau minta survei lokasi untuk pemasangan signage. Lokasi saya di: "],
    ["🎨", "Konsultasi desain gratis", "Halo Armada Advertising, saya mau konsultasi desain signage (gratis). Usaha saya: "],
    ["📦", "Tanya progres pesanan", "Halo Armada Advertising, saya mau menanyakan progres pesanan atas nama: "],
  ];
  $("#chatOpts").innerHTML = CHAT_OPTS.map(([em, label], k) =>
    '<button type="button" class="chat-opt" data-opt="' + k + '"><span aria-hidden="true">' + em + "</span>" + esc(label) + "</button>"
  ).join("");
  let chatTimer = null;
  function openChat() {
    chat.classList.add("is-open");
    chat.setAttribute("aria-hidden", "false");
    document.body.classList.add("chat-open");
    document.body.classList.remove("nav-hidden");
    const st = typeof openStatus === "function" ? openStatus() : null;
    const cs = $("#chatStatus");
    if (st) {
      cs.classList.toggle("is-open", st.open);
      cs.lastElementChild.textContent = st.open ? "Online · biasanya membalas cepat" : "Sedang tutup · dibalas " + st.next;
    }
    const body = $("#chatBody");
    body.classList.remove("is-ready");
    clearTimeout(chatTimer);
    chatTimer = setTimeout(() => body.classList.add("is-ready"), reduced ? 0 : 750);
    setTimeout(() => { if (!isMobile()) $("#chatMsg").focus({ preventScroll: true }); }, 300);
  }
  function closeChat() {
    chat.classList.remove("is-open");
    chat.setAttribute("aria-hidden", "true");
    document.body.classList.remove("chat-open");
  }
  const toggleChat = (e) => {
    e.preventDefault();
    chat.classList.contains("is-open") ? closeChat() : openChat();
  };
  $$(".fab, .tab-wa").forEach((el) => el.addEventListener("click", toggleChat));
  chat.addEventListener("click", (e) => {
    if (e.target.closest("[data-chat-close]")) return closeChat();
    const o = e.target.closest("[data-opt]");
    if (o) {
      const input = $("#chatMsg");
      const extra = input.value.trim();
      window.open(waLink(CHAT_OPTS[+o.dataset.opt][2] + extra), "_blank", "noopener");
      closeChat();
    }
  });
  $("#chatForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#chatMsg").value.trim();
    if (!v) { toast("Tulis pesan dulu, atau pilih topik di atas"); return; }
    window.open(waLink("Halo Armada Advertising, " + v), "_blank", "noopener");
    $("#chatMsg").value = "";
    closeChat();
  });
  document.addEventListener("click", (e) => {
    if (!chat.classList.contains("is-open")) return;
    if (e.target.closest(".chat-card, .fab, .tab-wa")) return;
    closeChat();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && chat.classList.contains("is-open")) closeChat(); });

  /* =========================================================
     SIMULATOR: own shop photo as wall
     ========================================================= */
  const photoIn = $("#simPhoto");
  let photoUrl = null;
  if (photoIn) {
    photoIn.addEventListener("change", () => {
      const f = photoIn.files && photoIn.files[0];
      if (!f || !simApi) return;
      if (!/^image\//.test(f.type)) { toast("File harus berupa gambar"); return; }
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      photoUrl = URL.createObjectURL(f);
      stage.style.setProperty("--photo", 'url("' + photoUrl + '")');
      simApi.st.wall = "foto";
      simApi.renderSim();
      simApi.setScale(0.8);
      simApi.setPos(0, -stage.clientHeight * 0.18);
      toast("Geser tulisannya untuk atur posisi");
      photoIn.value = "";
    });
  }

  /* ---------- lightbox: before / after ---------- */
  $("#lbBA").addEventListener("click", () => {
    const on = !lbMedia.classList.contains("show-before");
    lbMedia.classList.toggle("show-before", on);
    const ba = $("#lbBA");
    ba.setAttribute("aria-pressed", String(on));
    ba.lastElementChild.textContent = on ? "Lihat sesudah" : "Lihat sebelum";
    if (lb.classList.contains("is-story")) on ? storyPause() : storyResume();
  });

  /* =========================================================
     SEARCH PALETTE
     ========================================================= */
  const pal = $("#pal"), palInput = $("#palInput"), palList = $("#palList");
  const SECTIONS_TXT = [["home", "Beranda"], ["karya", "Portofolio"], ["produk", "Produk"], ["simulasi", "Simulasi signage"], ["kenapa", "Kenapa Armada"], ["proses", "Cara pesan"], ["faq", "FAQ"], ["kontak", "Kontak & pemesanan"]];
  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const goTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); };
  function openFaqItem(i) {
    goTo("faq");
    const q = document.getElementById("faq-q" + i);
    if (q && q.getAttribute("aria-expanded") !== "true") setTimeout(() => q.click(), 300);
  }
  let palAll = null, palShown = [], palIdx = 0;
  function palBuild() {
    const it = [];
    it.push({ g: "Aksi cepat", ic: "wa", t: "Chat WhatsApp", s: "Tanya langsung ke tim kami", k: "wa whatsapp chat tanya hubungi kontak admin", run: () => openChat() });
    it.push({ g: "Aksi cepat", ic: "compass", t: "Kuis pilih produk", s: "3 pertanyaan, langsung dapat rekomendasi", k: "kuis bingung rekomendasi pilih saran", run: () => openQuiz() });
    it.push({ g: "Aksi cepat", ic: "sparkle", t: "Coba simulasi signage", s: "Lihat desain siang & malam", k: "simulasi desain coba preview mockup", run: () => goTo("simulasi") });
    it.push({ g: "Aksi cepat", ic: "download", t: "Unduh katalog PDF", s: "Semua produk dalam satu file", k: "katalog pdf unduh download brosur print cetak", run: () => printCatalog() });
    PRODUCTS.forEach((p, i) => it.push({ g: "Produk", ic: "box", t: p.name, s: p.tagline, k: [p.category, p.desc, (p.uses || []).join(" "), p.specs.map((x) => x.join(" ")).join(" ")].join(" "), run: () => openSheet(i) }));
    PORTFOLIO.forEach((w, i) => it.push({ g: "Portofolio", ic: "grid", t: w.title, s: w.category + (w.place ? " · " + w.place : ""), k: [w.category, w.place].join(" "), run: () => { goTo("karya"); setTimeout(() => openLb(i), 400); } }));
    FAQ.forEach((f, i) => it.push({ g: "FAQ", ic: "chat", t: f.q, s: f.a.length > 72 ? f.a.slice(0, 72) + "…" : f.a, k: f.a, run: () => openFaqItem(i) }));
    SECTIONS_TXT.forEach(([id, l]) => it.push({ g: "Halaman", ic: "arrow", t: l, s: "Lompat ke bagian ini", k: id, run: () => goTo(id) }));
    it.forEach((x) => { x.hay = norm(x.t + " " + x.s + " " + x.k); x.nt = norm(x.t); });
    return it;
  }
  function palRender() {
    if (!palAll) palAll = palBuild();
    const q = norm(palInput.value).trim();
    if (!q) {
      palShown = palAll.filter((x) => x.g === "Aksi cepat").concat(palAll.filter((x) => x.g === "Produk").slice(0, 5));
    } else {
      const toks = q.split(/\s+/);
      palShown = palAll
        .map((x) => {
          if (!toks.every((t) => x.hay.includes(t))) return null;
          let sc = 0;
          toks.forEach((t) => { if (x.nt.startsWith(t)) sc += 4; else if (x.nt.includes(t)) sc += 2; });
          return { x, sc };
        })
        .filter(Boolean)
        .sort((a, b) => b.sc - a.sc)
        .slice(0, 14)
        .map((r) => r.x);
    }
    palIdx = 0;
    if (!palShown.length) {
      palList.innerHTML = '<div class="pal-empty"><b>Tidak ketemu "' + esc(palInput.value) + '"</b><span>Coba kata lain, atau tanya langsung ke kami.</span>' +
        '<button type="button" class="btn btn-yellow btn-sm" data-pal-wa><svg class="i"><use href="#i-wa"/></svg> Tanya via WhatsApp</button></div>';
      return;
    }
    let html = "", lastG = "";
    palShown.forEach((x, i) => {
      if (x.g !== lastG) { html += '<p class="pal-g">' + esc(x.g) + "</p>"; lastG = x.g; }
      html += '<button type="button" class="pal-item' + (i === 0 ? " is-active" : "") + '" role="option" data-pi="' + i + '" aria-selected="' + (i === 0) + '">' +
        '<span class="pal-ic"><svg class="i"><use href="#i-' + x.ic + '"/></svg></span><span class="pal-tx"><b>' + esc(x.t) + "</b><small>" + esc(x.s) + "</small></span>" +
        '<svg class="i pal-go" aria-hidden="true"><use href="#i-arrow"/></svg></button>';
    });
    palList.innerHTML = html;
  }
  function palSetActive(i) {
    const items = $$(".pal-item", palList);
    if (!items.length) return;
    palIdx = (i + items.length) % items.length;
    items.forEach((el, k) => { el.classList.toggle("is-active", k === palIdx); el.setAttribute("aria-selected", String(k === palIdx)); });
    items[palIdx].scrollIntoView({ block: "nearest" });
  }
  function openPal() {
    if (sheet.classList.contains("is-open") || lb.classList.contains("is-open")) return;
    if (typeof closeChat === "function") closeChat();
    pal.classList.add("is-open");
    pal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    setInert(true);
    palInput.value = "";
    palRender();
    setTimeout(() => palInput.focus(), 30);
  }
  function closePal() {
    pal.classList.remove("is-open");
    pal.setAttribute("aria-hidden", "true");
    lockScroll(false);
    setInert(false);
  }
  function palRun(i) {
    const x = palShown[i];
    if (!x) return;
    closePal();
    setTimeout(x.run, 60);
  }
  $("#searchOpen").addEventListener("click", openPal);
  palInput.addEventListener("input", palRender);
  palInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); palSetActive(palIdx + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palSetActive(palIdx - 1); }
    else if (e.key === "Enter") { e.preventDefault(); palRun(palIdx); }
  });
  pal.addEventListener("click", (e) => {
    if (e.target.closest("[data-pal-close]")) return closePal();
    if (e.target.closest("[data-pal-wa]")) { const q = palInput.value; closePal(); window.open(waLink("Halo Armada Advertising, saya mau tanya soal: " + q), "_blank", "noopener"); return; }
    const it = e.target.closest(".pal-item");
    if (it) palRun(+it.dataset.pi);
  });
  pal.addEventListener("mousemove", (e) => { const it = e.target.closest(".pal-item"); if (it && +it.dataset.pi !== palIdx) palSetActive(+it.dataset.pi); });
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);
    if (pal.classList.contains("is-open")) {
      if (e.key === "Escape") { e.preventDefault(); closePal(); }
      if (e.key === "Tab") trapTab(e, pal);
      return;
    }
    if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
      e.preventDefault();
      openPal();
    }
  });

  /* =========================================================
     TESTIMONI (hidden until data exists)
     ========================================================= */
  const TESTI = (window.TESTIMONI || []).filter((t) => t && t.text);
  const testiSec = $("#testimoni");
  if (testiSec && TESTI.length) {
    testiSec.hidden = false;
    const list = $("#testiList");
    list.innerHTML = TESTI.map((t) => {
      const r = Math.max(0, Math.min(5, Math.round(+t.rating || 5)));
      const initial = esc((t.name || "?").trim().charAt(0).toUpperCase());
      return '<figure class="testi-card reveal">' +
        '<div class="testi-stars" aria-label="Rating ' + r + ' dari 5">' + '<svg class="i"><use href="#i-star"/></svg>'.repeat(r) + "</div>" +
        "<blockquote>“" + esc(t.text) + "”</blockquote>" +
        '<figcaption><span class="testi-av">' + initial + "</span><span><b>" + esc(t.name || "") + "</b><small>" + esc(t.business || "") + "</small></span>" +
        (t.product ? '<span class="testi-prod">' + esc(t.product) + "</span>" : "") + "</figcaption></figure>";
    }).join("");
    testiSec.addEventListener("click", (e) => {
      const b = e.target.closest("[data-testi]");
      if (!b) return;
      const card = list.firstElementChild;
      list.scrollBy({ left: (+b.dataset.testi) * (card ? card.offsetWidth + 16 : 320), behavior: "smooth" });
    });
  }

  /* =========================================================
     MAP CARD
     ========================================================= */
  const mapCard = $("#mapCard");
  if (mapCard) {
    const addr = SITE.address || "";
    const routeUrl = SITE.mapsUrl || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addr);
    const embed = /^https:\/\/www\.google\.com\/maps\/embed\?/.test(SITE.mapsEmbed || "") ? SITE.mapsEmbed : "";
    mapCard.innerHTML =
      (embed
        ? '<iframe class="map-frame" src="' + esc(embed) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Peta lokasi workshop"></iframe>'
        : '<div class="map-art" aria-hidden="true"><span class="map-road r1"></span><span class="map-road r2"></span><span class="map-road r3"></span><span class="map-pin"><svg viewBox="0 0 100 100"><path d="M50 4L98 96H2z" fill="#B5141D"/><path d="M50 4L61 68L2 96z" fill="#DA1C24"/><path d="M50 4L98 96L61 68z" fill="#8A0D16"/></svg></span></div>') +
      '<div class="map-row"><div class="map-info"><b>Workshop Armada</b><span>' + esc(addr) + "</span></div>" +
      '<a class="btn btn-dark btn-sm" href="' + esc(routeUrl) + '" target="_blank" rel="noopener"><svg class="i" aria-hidden="true"><use href="#i-route"/></svg> Rute</a></div>';
  }

  /* =========================================================
     COMPARE PRODUCTS
     ========================================================= */
  const tray = $("#cmpTray");
  function paintCmp() {
    tray.classList.toggle("is-show", cmpList.length > 0);
    $("#cmpChips").innerHTML = cmpList.map((i) =>
      '<span class="cmp-chip">' + esc(PRODUCTS[i].name) + '<button type="button" data-cmp-rm="' + i + '" aria-label="Hapus ' + esc(PRODUCTS[i].name) + '">×</button></span>'
    ).join("") + (cmpList.length < 3 ? '<span class="cmp-hint">' + (cmpList.length < 2 ? "Pilih 1 lagi" : "Bisa tambah 1 lagi") + "</span>" : "");
    $("#cmpGo").disabled = cmpList.length < 2;
    const b = sheetBody.querySelector("[data-cmp]");
    if (b) b.setAttribute("aria-pressed", String(cmpList.includes(curProduct)));
  }
  function toggleCmp(i) {
    const k = cmpList.indexOf(i);
    if (k > -1) { cmpList.splice(k, 1); toast(PRODUCTS[i].name + " dihapus dari perbandingan"); }
    else {
      if (cmpList.length >= 3) { toast("Maksimal 3 produk untuk dibandingkan"); return; }
      cmpList.push(i);
      toast(PRODUCTS[i].name + " masuk perbandingan (" + cmpList.length + "/3)");
    }
    paintCmp();
  }
  function renderCompare() {
    sheetMode = "compare";
    const items = cmpList.map((i) => PRODUCTS[i]);
    const keys = [];
    items.forEach((p) => p.specs.forEach(([k]) => { if (!keys.includes(k)) keys.push(k); }));
    const cell = (p, k) => { const f = p.specs.find(([x]) => x === k); return f ? esc(f[1]) : '<span class="cmp-na">—</span>'; };
    const row = (label, fn) => "<tr><th scope=\"row\">" + label + "</th>" + items.map((p) => "<td>" + fn(p) + "</td>").join("") + "</tr>";
    sheetBody.innerHTML =
      '<div class="cmp"><p class="quiz-kick">Perbandingan</p><h3 class="quiz-q" id="sheetTitle">' + items.map((p) => esc(p.name)).join(" vs ") + "</h3>" +
      '<div class="cmp-scroll"><table class="cmp-table" style="--n:' + items.length + '"><thead><tr><td></td>' +
      items.map((p) => '<th scope="col"><div class="product-visual cmp-vis">' + productScene(p) + "</div><b>" + esc(p.name) + "</b><small>" + esc(p.tagline) + "</small></th>").join("") +
      "</tr></thead><tbody>" +
      keys.map((k) => row(esc(k), (p) => cell(p, k))).join("") +
      row("Cocok untuk", (p) => (p.uses || []).map(esc).join(", ")) +
      row("Harga", (p) => (p.startPrice ? "Mulai " + esc(p.startPrice) : "Sesuai ukuran")) +
      row("", (p) => '<div class="cmp-act"><button class="btn btn-soft btn-sm" data-detail="' + PRODUCTS.indexOf(p) + '">Detail</button>' +
        '<a class="btn btn-dark btn-sm" href="' + esc(waLink("Halo Armada Advertising, saya sedang membandingkan " + items.map((x) => x.name).join(", ") + ". Saya tertarik " + p.name + ", boleh minta info harganya?")) + '" target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> Tanya</a></div>') +
      "</tbody></table></div></div>";
    sheetPanel.scrollTop = 0;
  }
  function openCompare() {
    if (cmpList.length < 2) { toast("Pilih minimal 2 produk dulu"); return; }
    renderCompare();
    if (!sheet.classList.contains("is-open")) {
      lastFocus = document.activeElement;
      sheet.classList.add("is-open");
      sheet.setAttribute("aria-hidden", "false");
      lockScroll(true);
      setInert(true);
      $(".sheet-close", sheet).focus({ preventScroll: true });
    }
    setHash("produk");
  }
  sheet.addEventListener("click", (e) => { if (e.target.closest("[data-cmp]")) toggleCmp(curProduct); });
  tray.addEventListener("click", (e) => {
    const rm = e.target.closest("[data-cmp-rm]");
    if (rm) { toggleCmp(+rm.dataset.cmpRm); return; }
    if (e.target.closest("#cmpGo")) openCompare();
    if (e.target.closest("#cmpClear")) { cmpList.length = 0; paintCmp(); }
  });
  paintCmp();

  /* =========================================================
     PRINTABLE CATALOGUE (PDF via browser print)
     ========================================================= */
  function printCatalog() {
    const pc = $("#printCatalog");
    const month = new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long" });
    const tri = '<svg viewBox="0 0 100 100" class="pc-tri"><path d="M50 4L98 96H2z" fill="#B5141D"/><path d="M50 4L61 68L2 96z" fill="#DA1C24"/><path d="M50 4L98 96L61 68z" fill="#8A0D16"/></svg>';
    pc.innerHTML =
      '<section class="pc-cover"><div class="pc-logo"><span>CV.</span>' + tri + "<span>RMADA</span></div><p class=\"pc-sub\">ADVERTISING</p>" +
      "<h1>Katalog Produk Signage</h1><p class=\"pc-date\">" + esc(month) + "</p>" +
      '<ul class="pc-contact"><li><b>WhatsApp</b> +' + esc(SITE.whatsapp) + "</li><li><b>Instagram</b> " + esc(SITE.instagramHandle || "") + "</li><li><b>Alamat</b> " + esc(SITE.address || "") + "</li><li><b>Jam</b> " + esc(SITE.hours || "") + "</li></ul>" +
      '<p class="pc-note">Desain & konsultasi gratis · Produksi di workshop sendiri · Terima pemasangan</p></section>' +
      '<section class="pc-grid">' +
      PRODUCTS.map((p) =>
        '<article class="pc-item"><div class="pc-vis">' + productScene(p) + "</div><div class=\"pc-body\"><h2>" + esc(p.name) + '</h2><p class="pc-tag">' + esc(p.tagline) + "</p><p>" + esc(p.desc) + "</p>" +
        "<dl>" + p.specs.map(([k, v]) => "<div><dt>" + esc(k) + "</dt><dd>" + esc(v) + "</dd></div>").join("") + "</dl>" +
        '<p class="pc-uses"><b>Cocok untuk:</b> ' + (p.uses || []).map(esc).join(", ") + "</p>" +
        '<p class="pc-price">' + (p.startPrice ? "Harga mulai " + esc(p.startPrice) : "Harga sesuai ukuran & bahan — hitung gratis via WhatsApp") + "</p></div></article>"
      ).join("") +
      "</section>" +
      '<p class="pc-foot">CV Armada Advertising · wa.me/' + esc(SITE.whatsapp) + " · " + esc(SITE.instagramHandle || "") + "</p>";
    toast("Pilih \"Simpan sebagai PDF\" di jendela cetak");
    setTimeout(() => window.print(), 350);
  }
  $("#catalogBtn").addEventListener("click", printCatalog);
  window.addEventListener("afterprint", () => { $("#printCatalog").innerHTML = ""; });

  /* =========================================================
     FOOTER: product links + QR code
     ========================================================= */
  $("#footProducts").innerHTML = PRODUCTS.map((p) => '<li><a href="#produk/' + esc(p.id) + '">' + esc(p.name) + "</a></li>").join("");
  if (/^https?:$/.test(location.protocol)) {
    const qrCol = $("#qrCol");
    qrCol.hidden = false;
    const qio = new IntersectionObserver((en) => {
      if (!en[0].isIntersecting) return;
      qio.disconnect();
      const sc = document.createElement("script");
      sc.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
      sc.onload = () => {
        try {
          new window.QRCode($("#qrBox"), { text: location.origin + location.pathname, width: 116, height: 116, colorDark: "#0d0b0c", colorLight: "#ffffff", correctLevel: window.QRCode.CorrectLevel.M });
        } catch (err) { qrCol.hidden = true; }
      };
      sc.onerror = () => { qrCol.hidden = true; };
      document.head.appendChild(sc);
    }, { rootMargin: "300px" });
    qio.observe(qrCol);
  }

  /* =========================================================
     BATCH 6 — simpler UI, more interaction
     ========================================================= */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- hero: tap badge + scroll parallax ---------- */
  sign.addEventListener("click", () => sign.classList.add("was-tapped"), { once: true });
  const heroEl = $(".hero"), heroCopy = $(".hero-copy"), heroSignWrap = $(".sign-wrap");
  if (heroEl && !reduced) {
    let hTick = false;
    const heroScroll = () => {
      hTick = false;
      const p = Math.min(1, Math.max(0, window.scrollY / (heroEl.offsetHeight || 1)));
      heroCopy.style.translate = "0 " + (p * -48).toFixed(1) + "px";
      heroCopy.style.opacity = String(1 - p * 0.75);
      heroSignWrap.style.translate = "0 " + (p * 60).toFixed(1) + "px";
      heroSignWrap.style.scale = String(1 - p * 0.07);
    };
    window.addEventListener("scroll", () => { if (!hTick) { hTick = true; requestAnimationFrame(heroScroll); } }, { passive: true });
  }

  /* ---------- simulator: tabbed controls ---------- */
  const simCtr = $(".sim-controls");
  if (simCtr) {
    const grp = (sel) => { const el = $(sel); return el ? el.closest(".sim-group") : null; };
    const PANES = [
      ["teks", "Teks", "text", [simCtr.querySelector(".field"), grp('[data-key="font"]')]],
      ["jenis", "Jenis", "shapes", [grp('[data-key="type"]')]],
      ["warna", "Warna", "palette", [grp('[data-key="color"]')]],
      ["dinding", "Dinding", "wall", [grp('[data-key="wall"]')]],
      ["ukuran", "Ukuran", "ruler", [grp("#simDist")]],
    ];
    const tabs = document.createElement("div");
    tabs.className = "sim-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "Pengaturan simulasi");
    tabs.innerHTML = '<span class="sim-tab-pill" aria-hidden="true"></span>' + PANES.map(([id, label, ic], k) =>
      '<button type="button" class="sim-tab' + (k ? "" : " is-on") + '" role="tab" data-pane="' + id + '" aria-selected="' + !k + '"><svg class="i" aria-hidden="true"><use href="#i-' + ic + '"/></svg><span>' + label + "</span></button>"
    ).join("");
    const panesWrap = document.createElement("div");
    panesWrap.className = "sim-panes";
    PANES.forEach(([id, , , nodes], k) => {
      const pane = document.createElement("div");
      pane.className = "sim-pane" + (k ? "" : " is-on");
      pane.dataset.pane = id;
      pane.setAttribute("role", "tabpanel");
      nodes.forEach((n) => n && pane.appendChild(n));
      panesWrap.appendChild(pane);
    });
    const actions = simCtr.querySelector(".sim-actions");
    simCtr.insertBefore(panesWrap, actions);
    simCtr.insertBefore(tabs, panesWrap);
    const pill = $(".sim-tab-pill", tabs);
    const pillTo = (b) => { if (!b) return; pill.style.width = b.offsetWidth + "px"; pill.style.transform = "translateX(" + b.offsetLeft + "px)"; };
    const activeTab = () => $(".sim-tab.is-on", tabs);
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest(".sim-tab");
      if (!b) return;
      $$(".sim-tab", tabs).forEach((x) => { x.classList.toggle("is-on", x === b); x.setAttribute("aria-selected", String(x === b)); });
      $$(".sim-pane", panesWrap).forEach((p) => p.classList.toggle("is-on", p.dataset.pane === b.dataset.pane));
      pillTo(b);
      b.scrollIntoView({ inline: "nearest", block: "nearest" });
    });
    requestAnimationFrame(() => pillTo(activeTab()));
    window.addEventListener("resize", () => pillTo(activeTab()));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => pillTo(activeTab()));
  }

  /* ---------- products: tilt (desktop), centre focus + dots (mobile) ---------- */
  const prodCards = $$(".product", productsEl);
  if (finePointer && !reduced) {
    prodCards.forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (-y * 7).toFixed(2) + "deg) rotateY(" + (x * 9).toFixed(2) + "deg) translateY(-6px)";
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }
  const prodDots = $("#prodDots");
  if (prodDots) {
    prodDots.innerHTML = PRODUCTS.map(() => "<i></i>").join("");
    let pTick = false;
    const centerFocus = () => {
      pTick = false;
      if (!isMobile()) { prodCards.forEach((c) => c.classList.remove("is-center", "is-side")); return; }
      let best = 0, bd = Infinity;
      prodCards.forEach((c, k) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - window.innerWidth / 2);
        if (d < bd) { bd = d; best = k; }
      });
      prodCards.forEach((c, k) => { c.classList.toggle("is-center", k === best); c.classList.toggle("is-side", k !== best); });
      [...prodDots.children].forEach((d, k) => d.classList.toggle("on", k === best));
    };
    productsEl.addEventListener("scroll", () => { if (!pTick) { pTick = true; requestAnimationFrame(centerFocus); } }, { passive: true });
    window.addEventListener("resize", centerFocus);
    centerFocus();
  }

  /* ---------- why: flip tiles ---------- */
  if (whyEl) {
    whyEl.innerHTML = WHY.map((w) =>
      '<button type="button" class="why-tile reveal" aria-pressed="false">' +
      '<span class="why-in"><span class="why-front"><svg class="why-ic" aria-hidden="true"><use href="#i-' + esc(w.icon) + '"/></svg><b>' + esc(w.title) + '</b><span class="why-more" aria-hidden="true">+</span></span>' +
      '<span class="why-back"><b>' + esc(w.title) + "</b><span>" + esc(w.text) + "</span></span></span></button>"
    ).join("");
    whyEl.addEventListener("click", (e) => {
      const t = e.target.closest(".why-tile");
      if (!t) return;
      const on = !t.classList.contains("is-flipped");
      t.classList.toggle("is-flipped", on);
      t.setAttribute("aria-pressed", String(on));
    });
  }

  /* ---------- process: interactive stepper ---------- */
  const STEPS = [
    ["Chat WhatsApp", "Kirim foto lokasi & kebutuhanmu."],
    ["Desain & harga", "Mockup + penawaran, gratis."],
    ["Produksi", "Dikerjakan di workshop sendiri."],
    ["Pemasangan", "Dipasang sampai lampu menyala."],
  ];
  const stepper = $("#stepper");
  if (stepper) {
    let cur = 0, timer = null, inView = false, hovering = false;
    const body = $(".stepper-body", stepper);
    const setStep = (k) => {
      cur = k;
      $$(".stepper-node", stepper).forEach((n, i) => {
        n.classList.toggle("is-on", i === k);
        n.classList.toggle("is-done", i < k);
        n.setAttribute("aria-selected", String(i === k));
      });
      stepper.style.setProperty("--sp", String(k / (STEPS.length - 1)));
      $("#stNo").textContent = "0" + (k + 1);
      $("#stTitle").textContent = STEPS[k][0];
      $("#stText").textContent = STEPS[k][1];
      body.classList.remove("swap");
      void body.offsetWidth;
      body.classList.add("swap");
    };
    const restart = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => { if (inView && !hovering && !document.hidden) setStep((cur + 1) % STEPS.length); }, 3200); };
    stepper.addEventListener("click", (e) => { const n = e.target.closest(".stepper-node"); if (n) { setStep(+n.dataset.s); restart(); } });
    stepper.addEventListener("pointerenter", () => { hovering = true; });
    stepper.addEventListener("pointerleave", () => { hovering = false; });
    new IntersectionObserver((en) => { inView = en[0].isIntersecting; }, { threshold: 0.4 }).observe(stepper);
    setStep(0);
    restart();
  }

  /* ---------- portfolio: sliding filter pill + tilt/glare ---------- */
  const fpill = document.createElement("span");
  fpill.className = "chip-pill";
  fpill.setAttribute("aria-hidden", "true");
  filters.prepend(fpill);
  const moveFilterPill = () => {
    const a = $(".chip.is-active", filters);
    if (!a) return;
    fpill.style.width = a.offsetWidth + "px";
    fpill.style.height = a.offsetHeight + "px";
    fpill.style.transform = "translate(" + a.offsetLeft + "px," + a.offsetTop + "px)";
  };
  filters.addEventListener("click", () => requestAnimationFrame(moveFilterPill));
  window.addEventListener("resize", moveFilterPill);
  requestAnimationFrame(moveFilterPill);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveFilterPill);
  if (finePointer && !reduced) {
    gallery.addEventListener("pointermove", (e) => {
      const w = e.target.closest(".work");
      if (!w) return;
      const r = w.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      w.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      w.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      w.style.transform = "perspective(1000px) rotateX(" + ((0.5 - y) * 5).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 7).toFixed(2) + "deg)";
    });
    gallery.addEventListener("pointerout", (e) => {
      const w = e.target.closest(".work");
      if (w && !w.contains(e.relatedTarget)) w.style.transform = "";
    });
  }

  /* ---------- contact: compact (route link instead of big map art) ---------- */
  if (mapCard && !mapCard.querySelector("iframe")) {
    const routeA = mapCard.querySelector("a.btn");
    const href = routeA ? routeA.href : "";
    mapCard.remove();
    const pinLi = $$(".contact-list li").find((li) => li.querySelector('use[href="#i-pin"]'));
    if (pinLi && href) pinLi.insertAdjacentHTML("beforeend", '<a class="route-link" href="' + esc(href) + '" target="_blank" rel="noopener">Rute <svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></a>');
  }

  /* ---------- tap ripple ---------- */
  if (!reduced) {
    document.addEventListener("pointerdown", (e) => {
      const t = e.target.closest(".btn, .chip, .mq-item, .quiz-opt, .chat-opt, .sim-tab, .pal-item, .tabbar a:not(.tab-wa)");
      if (!t) return;
      const r = t.getBoundingClientRect();
      const s = Math.max(r.width, r.height) * 2.2;
      const sp = document.createElement("span");
      sp.className = "ripple";
      sp.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
      t.appendChild(sp);
      setTimeout(() => sp.remove(), 650);
    }, { passive: true });
  }

  /* ---------- go ---------- */
  observeReveal();
  // hero elements: reveal (after intro, if any)
  setTimeout(() => requestAnimationFrame(() => $$(".hero .reveal").forEach((el) => el.classList.add("is-visible"))), hasIntro ? 1200 : 0);

  /* ---------- deep links: #produk/neon-box, #karya/3 ---------- */
  function route() {
    const raw = location.hash.slice(1);
    if (raw.startsWith("sim?") && applySim) {
      applySim(new URLSearchParams(raw.slice(4)));
      $("#simulasi").scrollIntoView();
      return;
    }
    if (raw === "produk/cari") { $("#produk").scrollIntoView(); openQuiz(); return; }
    const h = decodeURIComponent(raw);
    let m;
    if ((m = h.match(/^produk\/(.+)$/))) {
      const i = PRODUCTS.findIndex((p) => p.id === m[1]);
      if (i > -1) { $("#produk").scrollIntoView(); openSheet(i); }
    } else if ((m = h.match(/^karya\/(\d+)$/))) {
      const i = +m[1] - 1;
      if (PORTFOLIO[i]) { $("#karya").scrollIntoView(); openLb(i); }
    }
  }
  route();
  window.addEventListener("hashchange", () => {
    if (!sheet.classList.contains("is-open") && !lb.classList.contains("is-open")) route();
  });
})();
