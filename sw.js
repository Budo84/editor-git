const CACHE_NAME = 'md-editor-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    // CDN esterne (Tailwind e Marked). 
    // Nota: La cache dinamica (sotto) è più robusta per i CDN, ma li elenchiamo qui per sicurezza.
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

// Installazione: scarica le risorse essenziali
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Fetch: intercetta le richieste di rete
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Se è nella cache, restituiscilo
            if (cachedResponse) {
                return cachedResponse;
            }
            // Altrimenti scaricalo dalla rete
            return fetch(event.request).then((networkResponse) => {
                // Se è una risposta valida, salvala nella cache per il futuro (Cache Dinamica)
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            });
        })
    );
});
