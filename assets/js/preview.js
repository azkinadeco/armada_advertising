/* =========================================================
   Pratinjau draf dari Panel Pengaturan (admin.html).
   Aktif hanya di browser pemilik saat membuka index.html?preview=1.
   Pengunjung biasa tidak terpengaruh.
   ========================================================= */
(function () {
  "use strict";
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("preview") === "0") { sessionStorage.setItem("armada-preview", ""); return; }
    if (q.get("preview") === "1") sessionStorage.setItem("armada-preview", "1");
    if (sessionStorage.getItem("armada-preview") !== "1") return;
    var d = JSON.parse(localStorage.getItem("armada-admin-draft") || "null");
    if (!d || !d.SITE) return;
    var blobs = {};
    try { blobs = JSON.parse(localStorage.getItem("armada-admin-blobs") || "{}"); } catch (e) {}
    var fix = function (o) {
      ["image", "thumb", "before"].forEach(function (k) { if (o && o[k] && blobs[o[k]]) o[k] = blobs[o[k]]; });
      return o;
    };
    ["SITE", "PRODUCTS", "PORTFOLIO", "WHY", "FAQ", "TESTIMONI"].forEach(function (k) { if (d[k]) window[k] = d[k]; });
    (window.PRODUCTS || []).forEach(fix);
    (window.PORTFOLIO || []).forEach(fix);
    document.addEventListener("DOMContentLoaded", function () {
      var b = document.createElement("div");
      b.className = "preview-bar";
      b.setAttribute("role", "status");
      b.innerHTML = '<span><b>Pratinjau draf</b> · hanya terlihat di browser ini</span><a href="admin.html">Edit</a><a href="index.html?preview=0">Keluar</a>';
      document.body.appendChild(b);
    });
  } catch (e) {}
})();
