// Uncomment the lines below to set up the cache files

const CACHE_NAME = 'budget-tracker-cache-4';
const DATA_CACHE_NAME = 'budget-tracker-data-cache-v3';
const TRANSACTION_CACHE_NAME = 'budget-tracker-trans-cache-v3';
const TRANSACTION_URL = ['/api/transaction']


const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // '/assets/js/vendor/chart-min.js',
  // '/assets/css/vendor/font-awesome.css',
  '/idb.js',
  // '/service-worker.js',
  '/assets/js/script.js',
  '/assets/css/styles.css',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png'
];


self.addEventListener('install', function(evt)  {
    console.log('================== [Service Worker] CACHING Install ====================');   
    evt.waitUntil( (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(FILES_TO_CACHE);
      // const transactionCache = await caches.open(TRANSACTION_CACHE_NAME);
      // transactionCache.addAll(TRANSACTION_URL);
    })
    ())
    // cacheOfflineFiles();
    // cself.ski}
    self.skipWaiting();
    
});


// });

// Activate the service worker and remove old data from the cache
// YOUR CODE HERE
//

// self.addEventListener('activate', (event) => {
//     event.waitUntil((async () => {
//       // Enable navigation preload if it's supported.
//       // See https://developers.google.com/web/updates/2017/02/navigation-preload
//       if ('navigationPreload' in self.registration) {
//         await self.registration.navigationPreload.enable();
//       }
//     })());
// self.addEventListener('activate', evt => {
//   // console.log('================== [Service Worker] Activation ====================');   
//   evt.waitUntil( async function() {
//     if (self.registration.navigationPreload) {
//       // Enable navigation preloads!
//       await self.registration.navigationPreload.enable();
//       console.log('========= PRELOAD FEATURE ENABLED ============')
//     }
//   }());
// })
self.addEventListener('activate', evt => {
    console.log('================== [Service Worker] Activation ====================');   
    evt.waitUntil(
      caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    // console.log(key)
                    // if (key === TRANSACTION_CACHE_NAME) {
                    //   caches.delete(key);
                    //   caches.open(TRANSACTION_CACHE_NAME).then (cache => {
                    //     fetch(TRANSACTION_URL).then( response => {
                    //       if (response.status===200) {
                    //         cache.put(TRANSACTION_URL, response.clone());
                    //       }
                    //     return response;
                    //     })
                    //   })
                    // } else
                     if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('Removing old cache data', key);
                        return caches.delete(key);
                    }
                  })
            )
          })
        
          )
            
    
    self.clients.claim();
});


// Intercept fetch requests
// YOUR CODE HERE
//

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const requestURL = new URL(event.request.url);
  if (requestURL.origin === location.origin) {
    event.respondWith(async function() {
      // Respond from the cache if we can
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      // Else, use the preloaded response, if it's there
      const response = await event.preloadResponse;
      if (response) return response;

      // Else try the network.
      return fetch(event.request);
  }());
}
});

self.addEventListener('fetch', evt => {
  const requestURL = new URL(evt.request.url);
  if (requestURL.origin === location.origin) {
    if (requestURL.pathname.match(/api\/transaction\/$/)) {
      // console.log(evt.request);
      if (evt.request.method === 'GET') return;
        evt.respondWith(
          caches
          .open(TRANSACTION_CACHE_NAME)
          .then(cache => {
            fetch(evt.request)
            .then(response => {
              // console.log(response);
                if ( response.status === 200 ) { 
                  return response
                  // return response.clone()
                }
            }).catch(err => {    
              saveRecord(evt.request.body);
              console.log('code: '+err.statusCode+'\nMessage: '+err.statusText)
            })

          
        })
        .catch( err =>  { console.log(err) })
        )
      }
  
    // } else if (requestURL.pathname.match('/\/[(\w)+|$]/')) {
    // console.log('MATCH 2');
    // evt.respondWith(
    // caches.match(evt.request).then(function(response) {
    // if(response) {
    //   return response;
    // }
    // else if (evt.request.headers.get('accept').includes('text/html')) {
    //       // return the cached home page for all requests for html pages
    //       // let root = evt.request.pathname.split()
    //       console.log('##### SECOND IF #### ')
    //       console.log(evt)
    //       return caches.match('/');
    // } else {
    //     return fetch(evt.request);
    // }
    // })
    // }
  }
});
                // })
                // .catch(  e => { console.log(e) } )
                // .then(responseData => {
                //     cache.put(evt.request,JSON.parse(responseData));
                // })
    // }
              // }
  // });

            // async () => {
            // const cache = await caches.open(TRANSACTION_CACHE_NAME);
            // try {
            //     const response = await fetch(evt.request);
            //     console.log(response);
            //     if (response.status === 200) {
            //         cache.put(evt.request, response);
            //     }
            //     return response.clone();
            // } catch (err) {
                
            //     return err;
            // }
//     });
// });
  