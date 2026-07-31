const CACHE_NAME = 'md-editor-v5-fix'; // Cambia questo nome ad ogni release per forzare l'aggiornamento della PWA
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js', // versione allineata a quella usata in index.html
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
    'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs' // mancava: senza questo, i diagrammi non funzionano offline
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Forza l'attivazione immediata
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Cancella la vecchia cache rotta
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
