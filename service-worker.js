
<<<<<<< HEAD
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
=======
const CACHE_NAME = 'morse-mentor-cache-vX.X-build'; // Update version
const urlsToCache = [
  '/',
  '/index.html', // This will be the index.html from dist
  '/main.js',    // Your bundled JavaScript
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Keep relevant external resources
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  // ... potentially specific font files if you know their exact URLs from Google Fonts
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add all URLs, but don't fail install if some external resources are unreachable during install
        const cachePromises = urlsToCache.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache} during install:`, err);
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            });
        });
        return Promise.all(cachePromises);
      })
<<<<<<< HEAD
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
=======
      .then(() => self.skipWaiting()) // Activate new service worker immediately
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
<<<<<<< HEAD
    }).then(() => self.clients.claim()) 
=======
    }).then(() => self.clients.claim()) // Take control of uncontrolled clients
  );
});

// Fetch event: serve from cache, fallback to network, then cache new requests
self.addEventListener('fetch', (event) => {
  // For navigation requests, use a network-first strategy to ensure fresh HTML.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, cache the new response for offline use.
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, serve the cached HTML (e.g., index.html).
          return caches.match('/'); // Or specific HTML like '/index.html'
        })
    );
    return;
  }
  
  // For other requests (CSS, JS, images), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache dynamic .tsx or .js files from esm.sh or other CDNs if they are not pre-cached
                // Be careful with caching opaque responses if not desired.
                if (event.request.url.startsWith('https://esm.sh/') || event.request.url.includes('gstatic')) {
                     cache.put(event.request, responseToCache);
                } else if (!urlsToCache.includes(event.request.url) && (event.request.url.endsWith('.js') || event.request.url.endsWith('.tsx'))) {
                    // This logic might be too broad for .tsx if source maps or other non-essential .tsx are fetched
                    // cache.put(event.request, responseToCache); 
                }
              });

            return networkResponse;
          }
        ).catch(error => {
            console.error('Fetching failed:', error);
            // Optionally, return a fallback offline page/resource for specific types
            // For example, for images: return caches.match('/offline-image.png');
            // For now, just let the browser handle the error.
        });
      })
>>>>>>> c6fa3e76b7f28984db453aee733759848f1bdfde
  );
});
