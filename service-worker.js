/* ===== YOUCHAT SERVICE WORKER - VERSIÓN 1.6.0 ===== */
const CACHE_NAME = 'youchat-v1.6.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './favicon.ico',
  './apple-touch-icon.png',
  './img/logo.png',
  './img/hero-bg.mp4',
  './img/staff-milkar.png',
  './img/staff-disney.png',
  './img/staff-miguel.png',
  './img/staff-dariel.png',
  './img/meme-1.png',
  './img/meme-2.png',
  './img/meme-3.png',
  './img/meme-4.png',
  './img/meme-5.png',
  './img/meme-6.png',
  './img/meme-7.png',
  './img/noticia-instalar.png',
  './img/noticia-linux.png',
  './img/noticia-apk.png',
  './img/noticia-privado.png',
  './img/noticia-retoma.png',
  './img/noticia-seguridad.png',
  './img/noticia-seguro.png',
  './img/noticia-premium.png',
  './img/noticia-terminos.png',
  './img/noticia-privacidad.png',
  './img/noticia-sabias.png',
  './img/comunidad-telegram.png',
  './img/foros-mejoras.png',
  './img/terminos-privacidad.png'
];

/* ===== INSTALACIÓN ===== */
self.addEventListener('install', event => {
  console.log('[SW] Instalando versión', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS).catch(err => console.log('Algunas imágenes no se pudieron cachear:', err)))
      .then(() => self.skipWaiting())
  );
});

/* ===== ACTIVACIÓN ===== */
self.addEventListener('activate', event => {
  console.log('[SW] Activando versión', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

/* ===== FETCH - ESTRATEGIA NETWORK FIRST ===== */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          return cached || caches.match('./index.html');
        });
      })
  );
});

/* ===== MENSAJE PARA SKIP WAITING ===== */
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
