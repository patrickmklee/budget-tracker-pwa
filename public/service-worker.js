// Uncomment the lines below to set up the cache files
const OFFLINE_URL = 'offline.html'
const CACHE_NAME = 'budget-tracker-cache-v1';
const OFFLINE_CACHE_NAME = 'budget-tracker-offline-cache-v1';
const TRANSACTION_CACHE_NAME = 'budget-tracker-trans-cache-v1';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
//   '/offline.html',
  '/manifest.json',
  // '/assets/js/index.js',
  '/assets/js/index.js',
  '/assets/css/styles.css',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
];

const OFFLINE_TRANSACTIONS = [];
// Install the service worker
// YOUR CODE HERE
//

self.addEventListener('install', function(evt)  {
    console.log('================== [Service Worker] CACHING Install ====================');   
    evt.waitUntil(( async () => {
        const cache  = await caches.open(CACHE_NAME);
            // .open(CACHE_NAME)
            // .then(cache => {
        console.log("Your files pre-cached");
        await cache.addAll(FILES_TO_CACHE);
        })());
    self.skipWaiting();
});
// });

// self.addEventListener('install', (evt)  => {
//     console.log('================== [Service Worker] Offline Install ====================');   
//     evt.waitUntil(( async () => {
//     //     fetch(OFFLINE_URL, { credentials: 'include' }).then(response =>
//     //         caches.open(CACHE_NAME).then(cache => cache.put(OFFLINE_URL, response)),
//     //       ),
//     // );
//         const cache = await caches.open(CACHE_NAME);
//         // Setting {cache: 'reload'} in the new request will ensure that the response
//         // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
//         await cache.add(new Request(OFFLINE_URL, {cache: 'reload'})); 
//     })
//     );

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

self.addEventListener('activate', function(evt) {
    console.log('================== [Service Worker] Activation ====================');   
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    console.log(key)
                    if (key !== CACHE_NAME && key !== OFFLINE_CACHE_NAME && key !== TRANSACTION_CACHE_NAME) {
                        console.log('Removing old cache data', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
// Intercept fetch requests
// YOUR CODE HERE
//

// addEventListener('fetch', event => {
//     event.waitUntil(async function() {
//       // Exit early if we don't have access to the client.
//       // Eg, if it's cross-origin.
//       if (!event.clientId) return;
  
//       // Get the client.
//       const client = await clients.get(event.clientId);
//       // Exit early if we don't get the client.
//       // Eg, if it closed.
//       if (!client) return;
  
//       // Send a message to the client.
//       client.postMessage({
//         msg: "Hey I just got a fetch from you!",
//         url: event.request.url
//       });
  
//     }());
//   });


// self.addEventListener('fetch', (evt) => {
//     if (evt.request.mode === 'navigate') {
//         evt.respondWith((async () => {
//             try {
//                 // eturn evt.respondWith(
//                 const networkResponse = await fetch(evt.request);
//                 return networkResponse;
//             } catch(error) {
//                 console.log('Fetch failed; returning offline page instead.', error);

//                 const cache = await caches.open(CACHE_NAME);
//                 const cachedResponse = await cache.match(OFFLINE_URL);
//                 return cachedResponse;
//             // .catch(() => caches.match(OFFLINE_URL))
//         }
//     })());
//   }

// });
  
    // if (evt.request.url.includes('/offline')) {
    //     evt.respondWith(
    //     // urn new Promise( (resolve,reject) => {
    //         caches
    //         .open(TRANSACTION_CACHE_NAME)
    //         .then( cache => {
    //             return cache.add(evt.request)
    //             }
    //         ) 
    //         .catch(err => {
    //             console.log(err)
    //         })
            
    //     // })
    //     );
    //     return 
    // }
    //     evt.respondWith(
    //         fetch(evt.request)
    //         .then(response => {
    //             // if (response.status === 200) {
    //                 return response
    //             // }
    //             // Promise.reject(evt.request);
    //         })
    //         .catch( function() {
    //             console.log(JSON.stringify(evt.request,null,4));
    //             caches
    //             .open(TRANSACTION_CACHE_NAME)
    //             .then(cache => {
    //                 cache.add(evt.request);
    //             })
    //             .catch(err => console.log(err));

    //         })
            // caches
            //     .open(DATA_CACHE_NAME)
            //     .then(cache => {
            //         return fetch(evt.request)
            //             .then(response => {
            //                 if (response.status === 200) {
            //                     cache.put(evt.request.url, response.clone());
            //                 }
            //                 return response;
            //                 })
            //             .catch(err => {
            // // Network request failed, try to get it from the cache.
            // return cache.match(evt.request);
            //             });
            //     })
            //     .catch(err => console.log(err))
    //     );
    //     return;
    // }
    
self.addEventListener('fetch', (evt) => {
    if (!(evt.request.url.includes('/api')) ) return;
    evt.waitUntil( async () => {
        // const cache = await caches.open(TRANSACTION_CACHE_NAME);
        try {
            return caches.add(evt.request);
        } catch (err) {
            localStorage.setItem(Date.now(), evt.request.body);
            return err;
        }
    });
});
            // try {
            // let response = await fetch(evt.request);

        // const cache = await caches.open(TRANSACTION_CACHE_NAME);
    
            // if (evt.request.method === 'POST') {
    
            // // try {
            // //     fetch(evt.request).then(response => {   
    //                 if (response.status === 200) {
    //                     return response
    //                 } else {
    //                     throw Error('No Network Connection!')
    //                 }
    //             })
    //         } catch( err) {
    //             console.log(err);
    //             return err;
    //         }
    //     });
    // }

                
            // } catch (err) {
            //     // .then()
            // // .catch( function() {
            //     localStorage.setItem(localStorage.length, evt.request);    
                
            // }
                
                // cache.add(evt.request);
                    // .open( TRANSACTION_CACHE_NAME )
                    // .then( transactionCache => {
                    //         transactionCache.match(OFFLINE_URL)
                    //         .then( offlineData => {
                    //             if (offlineData !== undefined) {
                    //             console.log(JSON.stringify(offlineData,null,2));
                    //             const updatedData = offlineData.transactions.unshift(evt.request.body); //(evt.request.body,{...offlineData})
                    //             // evt.request.body) ///(OFFLINE_URL, updatedData) ;//(evt.request.body,{...offlineData}));
                    //             transactionCache.add(offlineData);
                    //             // return new Response(updatedData);
                    //         })
                    //         .catch( function() {
                    //             transactionCache.add(new Request(evt.request));
                    //             // return new Response(JSON.parse(evt.request.body));                           
                    //         });
                            
                    // })
                    // .catch(err => console.log(err));
                // })
    //     // return;
    //     })());
        
    // } 
    
    // if (evt.request.url.includes('/api')) {
    //     // && (requestURL.pathname.match('/api/'))) {
    // else {        
    //     return evt.respondWith(
    //         fetch(evt.request)
    //             .then(response => {
    //             if (response.status === 200) {       
    //                 console.log('=== Caching request '+requestURL);
    //             cache.put(evt.request,response.clone());
    //         }
    //         return response
            
    //     })
    //     .catch( err => {
    //         return cache.match(evt.request)
    //     }
    // }
        
                // caches
                // .open(TRANSACTION_CACHE_NAME)
                // .then(cache => {
            
                    
            // })
            // .catch(err => console.log(err));
self.addEventListener('fetch', evt => {
    if (evt.request.method !== 'GET') {
        return ;
    }
    const requestURL = new URL(evt.request.url);
    if (requestURL.origin === location.origin) {
        return evt.respondWith(
            fetch(evt.request)
            .catch(function() {
                return caches.match(evt.request).then(function(response) {
                if (response) {
                    return response;
                } else if (evt.request.headers.get('accept').includes('text/html')) {
                    // return the cached home page for all requests for html pages
                    return caches.match('/');
                    }
                        });
                })
        )
    }
});
    