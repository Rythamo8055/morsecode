
const CACHE_NAME = 'morse-tutor-cache-v6'; // Incremented cache version
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/dist/main.js', // Updated to cache the bundled JS
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  // Specific font files used by Roboto (example URLs, actual ones might vary based on user agent)
  'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2', // Regular
  'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2', // Medium
  'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4.woff2', // Bold
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`Opened cache and caching basic assets for ${CACHE_NAME}`);
        const cachePromises = urlsToCache.map(urlToCache => {
            const request = new Request(urlToCache, { mode: 'cors' });
            return cache.add(request).catch(err => { 
                if (urlToCache.startsWith('https://cdn.tailwindcss.com')) {
                    const noCorsRequest = new Request(urlToCache, { mode: 'no-cors' });
                    return cache.add(noCorsRequest).catch(noCorsErr => {
                        console.warn(`Failed to cache (no-cors) ${urlToCache}: ${noCorsErr.message}`);
                    });
                }
                console.warn(`Failed to cache ${urlToCache}: ${err.message}`);
            });
        });
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error(`Cache open/add failed during install ${CACHE_NAME}:`, error);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Strategy for esm.sh and Google Fonts: Cache falling back to network.
  // This is important because React and other dependencies are loaded from esm.sh
  if (url.hostname === 'esm.sh' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            if (networkResponse && networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(fetchError => {
            console.warn(`Network fetch failed for ${event.request.url}:`, fetchError);
            throw fetchError; 
          });
          return response || fetchPromise;
        });
      })
    );
    return;
  }

  // Strategy for app assets: Cache first, then network.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache hit
        }
        // Not in cache, fetch from network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we got a valid response
            if (networkResponse && networkResponse.ok && event.request.method === 'GET') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
          console.log(`Fetch failed for: ${event.request.url}. This might be due to being offline or a network issue.`, error);
          // Optionally, return a custom offline page or a generic error response for specific routes
          // if (event.request.mode === 'navigate') {
          //   return caches.match('/offline.html'); // You'd need an offline.html cached
          // }
        });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) 
  );
});
