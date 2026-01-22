const CACHE_NAME = 'md-editor-v2'; // Ho cambiato versione per forzare l'aggiornamento
const ASSETS_TO_CACHE = [
    './editor.html',      // <--- IMPORTANTE: punta al tuo editor
    './manifest.json',
    './icon.png',         // Ricordati di caricare l'icona!
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js' // Aggiungiamo MathJax che hai messo prima
];

// ...lascia il resto del file uguale...
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
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
