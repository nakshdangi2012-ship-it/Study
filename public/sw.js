/* Study service worker: caches the app shell only. It NEVER touches /api. */
const CACHE = 'study-v1';
const SHELL = ['/', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname === '/healthz' || url.pathname.startsWith('/admin')) return; // never cache API or admin
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); if (r.ok && url.pathname === '/') caches.open(CACHE).then(c => c.put('/', copy)); return r; })
      .catch(() => caches.match(req).then(m => m || caches.match('/offline.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(m => m || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
});
