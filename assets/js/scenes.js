/* =========================================================
   Ilustrasi SVG per kategori (dipakai sebagai placeholder
   sebelum foto asli tersedia). Deterministik per "seed".
   ========================================================= */
(() => {
  "use strict";
  const ACC = ["#f5e400", "#ff3fd0", "#22d3ff", "#ff3b3b", "#39ff88", "#ff9a3c"];
  const BRANDS = ["KOPI SENJA", "BARBER 23", "NUSA MART", "KLINIK SEHAT", "RASA KITA", "AUTO PRIMA", "GLOW BEAUTY", "TOKO MAJU", "LUMA CAFE", "FIT ZONE", "BAKSO DAZ", "MITRA JAYA"];
  const SCRIPT = ["good vibes", "coffee time", "open late", "hello", "stay wild", "sweet tooth"];
  const FONT = 'font-family="Montserrat, Arial, sans-serif" font-weight="900"';
  let uid = 0;

  const pick = (a, s) => a[((s % a.length) + a.length) % a.length];
  const rnd = (s) => { const x = Math.sin(s * 9301.13 + 49297.7) * 233280; return x - Math.floor(x); };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const f1 = (n) => n.toFixed(1);
  const darkOn = (c) => (c === "#ff3b3b" ? "#ffffff" : "#141012");

  function text(str, cx, y, fs, maxW, attrs) {
    const est = str.length * fs * 0.68;
    const tl = est > maxW ? ' textLength="' + maxW + '" lengthAdjust="spacingAndGlyphs"' : "";
    return '<text x="' + cx + '" y="' + y + '" text-anchor="middle" font-size="' + fs + '" ' + (attrs || "") + tl + ">" + esc(str) + "</text>";
  }
  function windows(x0, y0, w, h, cols, rows, seed, lit) {
    let o = "";
    const cw = w / cols, ch = h / rows;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const on = rnd(seed + r * 7 + c * 13) < lit;
        o += '<rect x="' + f1(x0 + c * cw + cw * 0.26) + '" y="' + f1(y0 + r * ch + ch * 0.25) + '" width="' + f1(cw * 0.48) + '" height="' + f1(ch * 0.46) + '" fill="' + (on ? "#ffd27a" : "#1d2236") + '" opacity="' + (on ? 0.85 : 1) + '"/>';
      }
    return o;
  }
  function skyline(seed, color, lit, H, minH, maxH) {
    let o = "", x = -10, k = 0;
    while (x < 410) {
      const w = 28 + rnd(seed + k) * 46;
      const h = minH + rnd(seed + k * 3 + 1) * (maxH - minH);
      o += '<rect x="' + f1(x) + '" y="' + f1(H - h) + '" width="' + f1(w) + '" height="' + f1(h) + '" fill="' + color + '"/>';
      if (lit > 0) o += windows(x, H - h + 8, w, h - 8, 3, Math.max(2, Math.round(h / 20)), seed + k * 17, lit);
      x += w + 2;
      k++;
    }
    return o;
  }
  function stars(seed, n, maxY) {
    let o = "";
    for (let i = 0; i < n; i++)
      o += '<circle cx="' + f1(rnd(seed + i) * 400) + '" cy="' + f1(rnd(seed + i * 5 + 2) * maxY) + '" r="' + (0.5 + rnd(seed + i * 11) * 1.1).toFixed(2) + '" fill="#fff" opacity="' + (0.3 + rnd(seed + i * 3) * 0.7).toFixed(2) + '"/>';
    return o;
  }
  const glowDef = (id, sd) => '<filter id="' + id + '" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="' + sd + '"/></filter>';
  const lin = (id, stops, vertical) =>
    '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical === false ? 1 : 0) + '" y2="' + (vertical === false ? 0 : 1) + '">' +
    stops.map(([o, c]) => '<stop offset="' + o + '" stop-color="' + c + '"/>').join("") + "</linearGradient>";

  /* ---------- scenes ---------- */
  function neonbox(s, id, b) {
    const a = pick(ACC, s), brand = pick(BRANDS, s), wall = pick(["#2b2326", "#1f2a2e", "#2e2a22", "#26212e"], s);
    return "<defs>" + lin(id + "s", [[0, "#080b22"], [1, "#2a1838"]]) + lin(id + "w", [[0, "#ffe2a6"], [1, "#e08a3c"]]) + glowDef(id + "g", 10) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 's)"/>' + stars(s, 26, 70) +
      skyline(s, "#121431", 0.35, 120, 40, 90) +
      '<rect x="36" y="64" width="328" height="236" fill="' + wall + '"/><rect x="28" y="56" width="344" height="12" rx="2" fill="#3a3033"/>' +
      (b ? '<rect x="96" y="96" width="208" height="40" fill="#000" opacity=".12"/><rect x="106" y="78" width="6" height="8" fill="#444"/>' :
      '<rect x="86" y="84" width="228" height="64" rx="8" fill="' + a + '" opacity=".8" filter="url(#' + id + 'g)"/>' +
      '<rect x="106" y="78" width="6" height="8" fill="#555"/><rect x="288" y="78" width="6" height="8" fill="#555"/>' +
      '<rect x="86" y="84" width="228" height="64" rx="8" fill="' + a + '"/><rect x="88" y="86" width="224" height="60" rx="7" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="3"/>' +
      text(brand, 200, 127, 28, 196, FONT + ' fill="' + darkOn(a) + '"')) +
      '<polygon points="62,168 256,168 264,190 54,190" fill="#c4141f"/><polygon points="62,168 256,168 264,190 54,190" fill="url(#' + id + 'w)" opacity=".12"/>' +
      '<rect x="64" y="190" width="186" height="100" fill="url(#' + id + 'w)"/>' +
      '<path d="M126 190v100M188 190v100" stroke="#1a1416" stroke-width="4"/><rect x="64" y="190" width="186" height="100" fill="none" stroke="#1a1416" stroke-width="5"/>' +
      '<rect x="80" y="252" width="34" height="22" rx="3" fill="#6b3a1d" opacity=".55"/><rect x="142" y="244" width="30" height="30" rx="15" fill="#7a3f1e" opacity=".45"/>' +
      '<rect x="272" y="176" width="64" height="114" fill="#15100f"/><rect x="280" y="186" width="48" height="62" fill="#ffcf7a" opacity=".32"/><rect x="282" y="252" width="5" height="10" fill="#c9b48a"/>' +
      '<rect y="288" width="400" height="12" fill="#0d0b0c"/>' + (b ? "" : '<ellipse cx="200" cy="292" rx="170" ry="10" fill="' + a + '" opacity=".28" filter="url(#' + id + 'g)"/>');
  }

  function timbul(s, id, b) {
    const brand = pick(BRANDS, s + 3);
    return "<defs>" + lin(id + "s", [[0, "#1d1838"], [0.6, "#6b3e5c"], [1, "#d0745a"]]) +
      lin(id + "au", [[0, "#fff5cc"], [0.35, "#f1c75c"], [0.55, "#a5711b"], [0.8, "#f6db88"], [1, "#c8932f"]]) +
      lin(id + "gl", [[0, "#22303c"], [1, "#121a22"]]) + glowDef(id + "g", 7) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 's)"/>' + skyline(s + 5, "#2a2140", 0.25, 150, 50, 110) +
      '<rect x="24" y="48" width="352" height="252" fill="#e8e0d2"/>' +
      [68, 112, 156, 200, 244, 288, 332].map((x) => '<path d="M' + x + ' 48v148" stroke="#d6ccbc" stroke-width="1.5"/>').join("") +
      '<path d="M24 100h352" stroke="#d6ccbc" stroke-width="1.5"/>' +
      '<rect x="24" y="190" width="352" height="9" fill="#2b2b2b"/><rect x="24" y="199" width="352" height="101" fill="url(#' + id + 'gl)"/>' +
      '<polygon points="60,199 100,199 60,300 20,300" fill="#fff" opacity=".06"/><polygon points="230,199 250,199 210,300 190,300" fill="#fff" opacity=".05"/>' +
      '<rect x="24" y="252" width="352" height="48" fill="#ffcf7a" opacity=".18"/>' +
      (b ? "" : text(brand, 200, 156, 36, 220, FONT + ' fill="#ffd27a" opacity=".55" filter="url(#' + id + 'g)"') +
      text(brand, 203, 159, 36, 220, FONT + ' fill="#6b470e"') +
      text(brand, 200, 156, 36, 220, FONT + ' fill="url(#' + id + 'au)"'));
  }

  function neonflex(s, id, b) {
    const a = pick(ACC, s + 1), word = pick(SCRIPT, s);
    const neon = (inner) =>
      '<g fill="none" stroke="' + a + '" stroke-linecap="round" stroke-linejoin="round" stroke-width="7" opacity=".7" filter="url(#' + id + 'g)">' + inner + "</g>" +
      '<g fill="none" stroke="' + a + '" stroke-linecap="round" stroke-linejoin="round" stroke-width="3">' + inner + "</g>" +
      '<g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" opacity=".85">' + inner + "</g>";
    const t = text(word, 200, 132, 40, 220, 'font-family="Pacifico, cursive"');
    return "<defs>" + lin(id + "w", [[0, "#241b2b"], [1, "#160f19"]]) + glowDef(id + "g", 6) + glowDef(id + "G", 30) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 'w)"/>' +
      [0, 1, 2, 3, 4, 5, 6, 7].map((k) => '<rect x="' + k * 50 + '" y="0" width="49" height="300" fill="#fff" opacity="' + (k % 2 ? 0.012 : 0.025) + '"/>').join("") +
      (b ? "" : '<ellipse cx="200" cy="118" rx="170" ry="70" fill="' + a + '" opacity=".16" filter="url(#' + id + 'G)"/>' +
      neon(t) + neon('<path d="M186 170c0-8 14-8 14 2 0-10 14-10 14-2 0 8-14 16-14 20-0-4-14-12-14-20z"/>')) +
      '<rect x="40" y="206" width="120" height="6" rx="2" fill="#3a2f3a"/>' +
      '<rect x="62" y="186" width="18" height="20" rx="3" fill="#4a3a2a"/><ellipse cx="71" cy="182" rx="14" ry="10" fill="#1f3a2a"/><ellipse cx="62" cy="176" rx="8" ry="12" fill="#25472f"/>' +
      '<rect x="108" y="190" width="30" height="16" rx="3" fill="#2a2230"/>' +
      '<rect x="250" y="236" width="130" height="64" rx="14" fill="#120d14"/><rect x="262" y="222" width="106" height="24" rx="10" fill="#1a141d"/>' +
      '<rect x="20" y="262" width="110" height="38" rx="8" fill="#0f0b11"/><ellipse cx="200" cy="300" rx="220" ry="20" fill="' + a + '" opacity=".1"/>';
  }

  function billboard(s, id, b) {
    const a = pick(ACC, s + 2), brand = pick(BRANDS, s + 6);
    const cloud = (x, y, k) => '<g fill="#fff" opacity=".92"><ellipse cx="' + x + '" cy="' + y + '" rx="' + 26 * k + '" ry="' + 11 * k + '"/><ellipse cx="' + (x + 16 * k) + '" cy="' + (y - 8 * k) + '" rx="' + 16 * k + '" ry="' + 12 * k + '"/><ellipse cx="' + (x - 14 * k) + '" cy="' + (y - 4 * k) + '" rx="' + 12 * k + '" ry="' + 9 * k + '"/></g>';
    return "<defs>" + lin(id + "s", [[0, "#3d8bff"], [1, "#cfe9ff"]]) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 's)"/><circle cx="345" cy="52" r="22" fill="#fff3b0"/><circle cx="345" cy="52" r="34" fill="#fff3b0" opacity=".25"/>' +
      cloud(70, 210, 1) + cloud(320, 190, 0.8) + cloud(250, 30, 0.6) +
      '<path d="M0 238 Q80 205 160 228 T320 222 T400 230 V300 H0z" fill="#3c9a62"/><path d="M0 252 Q120 232 220 250 T400 248 V300 H0z" fill="#2f8452"/>' +
      '<polygon points="150,300 250,300 214,252 186,252" fill="#3a3a3e"/><path d="M200 258v8M200 274v10M200 292v8" stroke="#f4f1ea" stroke-width="2"/>' +
      '<rect x="192" y="160" width="16" height="96" fill="#4a4d55"/><path d="M196 166l8 18M204 184l-8 18M196 202l8 18M204 220l-8 18" stroke="#3a3c43" stroke-width="2"/>' +
      '<rect x="72" y="30" width="256" height="134" rx="3" fill="#1b1b1f"/><rect x="80" y="38" width="240" height="118" fill="#ffffff"/>' +
      (b ? text("SPACE IKLAN", 200, 104, 20, 180, FONT + ' fill="#c9c9c9" letter-spacing="3"') :
      '<rect x="80" y="38" width="132" height="118" fill="' + a + '"/>' +
      text(brand, 146, 96, 19, 116, FONT + ' fill="' + darkOn(a) + '"') +
      text("SEGERA HADIR", 146, 120, 9, 104, FONT + ' fill="' + darkOn(a) + '" opacity=".75" letter-spacing="2"') +
      '<circle cx="266" cy="97" r="34" fill="' + a + '" opacity=".22"/><circle cx="266" cy="97" r="20" fill="#1b1b1f"/><path d="M258 97h16M268 90l7 7-7 7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>') +
      '<rect x="72" y="164" width="256" height="4" fill="#4a4d55"/>' +
      [110, 200, 290].map((x) => '<path d="M' + x + ' 30v-8h14" stroke="#4a4d55" stroke-width="3" fill="none"/>').join("");
  }

  function pylon(s, id, b) {
    const a = pick(ACC, s + 3), brand = pick(BRANDS, s + 1);
    const car = (x, c) => '<g><rect x="' + x + '" y="258" width="74" height="20" rx="8" fill="' + c + '"/><path d="M' + (x + 14) + ' 258l10-14h26l12 14z" fill="' + c + '"/><circle cx="' + (x + 18) + '" cy="279" r="7" fill="#111"/><circle cx="' + (x + 56) + '" cy="279" r="7" fill="#111"/><rect x="' + (x + 66) + '" y="264" width="8" height="4" rx="2" fill="#ffe7a0"/></g>';
    return "<defs>" + lin(id + "s", [[0, "#0f1435"], [0.7, "#4b2d63"], [1, "#a0506b"]]) + glowDef(id + "g", 10) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 's)"/>' + stars(s + 9, 22, 90) + skyline(s + 2, "#1d1838", 0.3, 262, 30, 80) +
      '<rect y="262" width="400" height="38" fill="#18171c"/><path d="M20 290h40M90 290h40M270 290h40M340 290h40" stroke="#f4f1ea" stroke-width="2" opacity=".4"/>' +
      '<rect x="160" y="34" width="80" height="222" rx="4" fill="#2a2b31"/>' + (b ? '<rect x="168" y="44" width="64" height="196" rx="4" fill="#3a3b42"/>' :
      '<rect x="160" y="34" width="7" height="222" fill="' + a + '"/>' +
      '<rect x="168" y="44" width="64" height="64" rx="6" fill="' + a + '" opacity=".7" filter="url(#' + id + 'g)"/>' +
      '<rect x="168" y="44" width="64" height="64" rx="6" fill="' + a + '"/><path d="M200 56l18 40h-36z" fill="' + darkOn(a) + '" opacity=".9"/>' +
      '<rect x="168" y="116" width="64" height="26" rx="3" fill="#fff"/>' + text(brand, 200, 133, 11, 56, FONT + ' fill="#141012"') +
      [150, 182, 214].map((y, k) => '<rect x="168" y="' + y + '" width="64" height="26" rx="3" fill="#f4f1ea"/><rect x="174" y="' + (y + 8) + '" width="' + (30 + k * 8) + '" height="4" rx="2" fill="#2a2b31"/><rect x="174" y="' + (y + 15) + '" width="22" height="3" rx="1.5" fill="' + pick(ACC, s + k + 4) + '"/>').join("")) +
      '<rect x="150" y="252" width="100" height="12" rx="2" fill="#34353c"/>' +
      (b ? "" : '<ellipse cx="200" cy="268" rx="120" ry="12" fill="' + a + '" opacity=".25" filter="url(#' + id + 'g)"/>') +
      car(22, "#3c4250") + car(300, "#5a2a30");
  }

  function acp(s, id, b) {
    const a = pick(ACC, s + 4), brand = pick(BRANDS, s + 4);
    let grid = "";
    for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) grid += '<rect x="' + (22 + c * 60) + '" y="' + (42 + r * 50) + '" width="57" height="47" fill="' + ((r + c) % 2 ? "#4a4e57" : "#444851") + '"/>';
    return "<defs>" + lin(id + "s", [[0, "#070a1e"], [1, "#1c2140"]]) + lin(id + "g2", [[0, "#eef4fb"], [1, "#8aa0b8"]]) + glowDef(id + "g", 7) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 's)"/>' + stars(s + 4, 20, 40) +
      '<rect x="20" y="40" width="360" height="260" fill="' + (b ? "#6b665e" : "#2a2c31") + '"/>' +
      (b ? '<path d="M20 100h360M20 150h360" stroke="#5c574f" stroke-width="2"/><rect x="60" y="60" width="70" height="26" fill="#57534c"/>' :
      grid + '<rect x="20" y="104" width="360" height="40" fill="#18191d"/>' +
      text(brand, 200, 133, 24, 210, FONT + ' fill="' + a + '" filter="url(#' + id + 'g)"') +
      text(brand, 200, 133, 24, 210, FONT + ' fill="#fff"')) +
      '<rect x="20" y="192" width="360" height="8" fill="#111"/><rect x="34" y="200" width="332" height="100" fill="url(#' + id + 'g2)" opacity=".9"/>' +
      '<path d="M117 200v100M200 200v100M283 200v100" stroke="#2a2c31" stroke-width="4"/>' +
      '<rect x="60" y="250" width="40" height="50" rx="4" fill="#5c6b7c" opacity=".5"/><rect x="230" y="236" width="30" height="64" rx="4" fill="#5c6b7c" opacity=".45"/>' +
      '<polygon points="40,200 70,200 40,260" fill="#fff" opacity=".25"/>';
  }

  function indoor(s, id, b) {
    const a = pick(ACC, s + 5), brand = pick(BRANDS, s + 7);
    let slats = "";
    for (let x = 0; x < 400; x += 14) slats += '<rect x="' + x + '" y="0" width="10" height="214" fill="' + (x % 28 ? "#8a5a33" : "#7a4e2b") + '"/>';
    return "<defs>" + lin(id + "ag", [[0, "#ffffff"], [0.35, "#ccd1d7"], [0.55, "#6c737b"], [0.8, "#eef1f4"], [1, "#9aa1a9"]]) + glowDef(id + "g", 9) + "</defs>" +
      '<rect width="400" height="300" fill="#5e3d22"/>' + slats +
      '<rect x="0" y="0" width="400" height="214" fill="#000" opacity=".12"/>' +
      [80, 200, 320].map((x) => '<polygon points="' + (x - 6) + ',0 ' + (x + 6) + ',0 ' + (x + 50) + ',214 ' + (x - 50) + ',214" fill="#fff6dc" opacity=".07"/><circle cx="' + x + '" cy="4" r="5" fill="#fff6dc"/>').join("") +
      (b ? "" : '<rect x="70" y="72" width="260" height="76" rx="6" fill="#000" opacity=".25" filter="url(#' + id + 'g)"/>' +
      text(brand, 202, 118, 32, 210, FONT + ' fill="#3a3f45"') +
      text(brand, 200, 116, 32, 210, FONT + ' fill="url(#' + id + 'ag)"') +
      '<rect x="150" y="128" width="100" height="3" rx="1.5" fill="' + a + '"/>') +
      '<rect y="214" width="400" height="86" fill="#cdbfa8"/>' +
      '<rect x="74" y="200" width="252" height="10" rx="3" fill="#2b2b2b"/><rect x="80" y="210" width="240" height="80" fill="#f4f1ea"/><rect x="80" y="250" width="240" height="6" fill="' + a + '"/>' +
      '<rect y="290" width="400" height="10" fill="#b9ab95"/>';
  }

  function branding(s, id, b) {
    const a = pick(ACC, s + 1), brand = pick(BRANDS, s + 8);
    return "<defs>" + lin(id + "s", [[0, "#ff9e5e"], [1, "#ffe2b8"]]) + "</defs>" +
      '<rect width="400" height="300" fill="url(#' + id + 's)"/><circle cx="80" cy="70" r="30" fill="#fff4d6" opacity=".8"/>' +
      skyline(s + 3, "#d98a57", 0, 236, 40, 120) + skyline(s + 8, "#c47447", 0, 236, 20, 70) +
      '<rect y="236" width="400" height="6" fill="#8b8b8b"/><rect y="242" width="400" height="58" fill="#2d2d30"/><path d="M0 284h40M80 284h40M160 284h40M240 284h40M320 284h40" stroke="#f4f1ea" stroke-width="3" opacity=".6"/>' +
      '<ellipse cx="200" cy="254" rx="160" ry="8" fill="#000" opacity=".3"/>' +
      '<path d="M48 244V128q0-12 12-12h196v128z" fill="#f7f7f7"/>' +
      '<path d="M256 140h50q12 0 20 12l34 40q6 8 6 18v34H256z" fill="#f1f1f1"/>' +
      '<path d="M268 152h36l30 38h-66z" fill="#2a3a4a"/><path d="M272 156h10l-4 30h-6z" fill="#fff" opacity=".2"/>' +
      (b ? "" : '<path d="M48 214C110 180 180 236 256 190v54H48z" fill="' + a + '"/><path d="M256 190c30-18 60-10 110 4v18H256z" fill="' + a + '"/>' +
      text(brand, 162, 168, 22, 140, FONT + ' fill="#141012"') +
      '<rect x="112" y="180" width="100" height="5" rx="2.5" fill="#141012" opacity=".5"/>') +
      '<rect x="346" y="210" width="12" height="8" rx="2" fill="#ffe7a0"/>' +
      [104, 300].map((x) => '<circle cx="' + x + '" cy="246" r="20" fill="#111"/><circle cx="' + x + '" cy="246" r="9" fill="#9a9a9a"/>').join("");
  }

  const MAP = { "Neon Box": neonbox, "Huruf Timbul": timbul, "Neon Flex": neonflex, Billboard: billboard, Pylon: pylon, "Fasad ACP": acp, Indoor: indoor, Branding: branding };

  window.ArmadaScene = {
    render(cat, seed, opts) {
      const id = "sc" + ++uid;
      const fn = MAP[cat] || neonbox;
      return '<svg class="scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' + fn(seed || 0, id, !!(opts && opts.bare)) + "</svg>";
    },
    city(seed) {
      return skyline(seed || 7, "#15173a", 0.4, 160, 50, 150) + skyline((seed || 7) + 31, "#0f1030", 0.25, 160, 25, 80);
    },
  };
})();
