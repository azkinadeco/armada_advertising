/* Service worker — CV Armada Advertising
   Strategi: network-first untuk file website (perubahan langsung terlihat),
   cache sebagai cadangan saat offline. Font Google: stale-while-revalidate.
   Naikkan VERSION jika ingin membersihkan cache lama. */
const VERSION = "armada-v1";
const CORE = [
  "./",
  "index.html",
  "404.html",
  "assets/css/style.css",
  "assets/js/data.js",
  "assets/js/main.js",
  "assets/img/icon-192.png",
  "assets/img/og-image.jpg",
  "manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: stale-while-revalidate
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(
      caches.open(VERSION).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req).then((res) => { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;

  // Same-origin: network first, fallback to cache, then index for navigations
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(async () => (await caches.match(req)) || (req.mode === "navigate" ? caches.match("index.html") : Response.error()))
  );
});
