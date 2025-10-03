// Service Worker pour Onin Technologie
// Version 1.0.0

const CACHE_NAME = 'onin-technologie-v1';
const STATIC_CACHE = 'onin-static-v1';
const DYNAMIC_CACHE = 'onin-dynamic-v1';

// Fichiers à mettre en cache lors de l'installation
const STATIC_FILES = [
  '/',
  '/index.html',
  '/projects.html',
  '/styles.css',
  '/Pictures/Logo Onin.png',
  '/Pictures/icon construction.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// URLs à ne pas mettre en cache
const EXCLUDED_URLS = [
  '/sw.js',
  '/manifest.json',
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static files', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Supprime les anciens caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Stratégie de cache : Cache First pour les ressources statiques, Network First pour le contenu dynamique
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip excluded URLs
  if (EXCLUDED_URLS.some(excludedUrl => request.url.includes(excludedUrl))) {
    return;
  }

  // Skip cross-origin requests (except fonts)
  if (url.origin !== location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Si la ressource est en cache, la retourner
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, la récupérer du réseau
        return fetch(request)
          .then(networkResponse => {
            // Vérifier que la réponse est valide
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = networkResponse.clone();

            // Déterminer le cache à utiliser
            let cacheName = DYNAMIC_CACHE;
            if (STATIC_FILES.includes(url.pathname) || url.hostname.includes('fonts.')) {
              cacheName = STATIC_CACHE;
            }

            // Mettre en cache la réponse
            caches.open(cacheName)
              .then(cache => {
                cache.put(request, responseToCache);
              })
              .catch(error => {
                console.error('Service Worker: Failed to cache response', error);
              });

            return networkResponse;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);

            // Retourner une page de fallback pour les pages HTML
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }

            // Pour les autres ressources, laisser l'erreur remonter
            throw error;
          });
      })
  );
});

// Nettoyage périodique du cache dynamique
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          return cache.keys().then(requests => {
            // Garder seulement les 50 dernières entrées
            if (requests.length > 50) {
              const requestsToDelete = requests.slice(0, requests.length - 50);
              return Promise.all(
                requestsToDelete.map(request => cache.delete(request))
              );
            }
          });
        })
    );
  }
});

// Gestion des mises à jour
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour disponible
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});