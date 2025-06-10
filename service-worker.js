const CACHE_NAME = 'morse-mentor-cache-v2.0'; // Updated version for build changes
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js',   // Cache the bundled application code
  '/manifest.json',
  // Static icons
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // External resources
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
  'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2', // Example, actual URLs might differ or be numerous
  // URLs from importmap
  'https://esm.sh/react@^19.1.0',
  'https://esm.sh/react-dom@^19.1.0/client',
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
            });
        });
        return Promise.all(cachePromises);
      })
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
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
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
              // For esm.sh, 30x redirects are common and should be followed, not treated as errors here.
              // The browser handles redirects transparently before this point usually.
              if (event.request.url.startsWith('https://esm.sh/')) {
                // This condition may allow non-200 responses from esm.sh to pass through without necessarily caching them if they are errors.
                // The actual caching below will only happen for valid (e.g. 200) responses.
              } else {
                 return networkResponse; // Return non-200 for non-esm.sh if not ok
              }
            }
            
            // Only cache valid, successful responses
            if (networkResponse && networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    // Cache dynamic .js files from esm.sh or other CDNs if they are not pre-cached
                    // This will cache the actual resolved versions from esm.sh
                    if (event.request.url.startsWith('https://esm.sh/') || event.request.url.includes('gstatic') || event.request.url.includes('googleapis')) {
                         cache.put(event.request, responseToCache);
                    }
                  });
            }
            return networkResponse;
          }
        ).catch(error => {
            console.error(`Fetching failed for ${event.request.url}:`, error);
            // Optionally, return a fallback offline page/resource for specific types
        });
      })
  );
});