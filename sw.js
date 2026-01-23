// AUMENTO LA VERSIONE PER FORZARE L'AGGIORNAMENTO (v3)
const CACHE_NAME = 'md-editor-v3'; 

const ASSETS_TO_CACHE = [
    './',                // La cartella radice
    './index.html',      // <--- ORA PUNTA A INDEX.HTML
    './manifest.json',
    './icon.png',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
];

self.addEventListener('install', (event) => {
    // Forza il nuovo service worker a prendere il controllo subito
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Aggiungiamo la pulizia della vecchia cache (v1, v2) per evitare conflitti
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Cancellazione vecchia cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request);
        })
    );
});
