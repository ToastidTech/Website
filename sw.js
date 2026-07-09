const CACHE = 'toastid-v3';

const ASSETS = [

'/',
'/index.html',
'/products.html',
'/about.html',
'/contact.html',
'/disclaimer.html',

'/manifest.json',

'/assets/styles.css',
'/assets/site.js',

'/assets/logos/shield-logo.jpg',
'/assets/logos/icon-192.png',
'/assets/logos/icon-512.png'

];

self.addEventListener('install', e => {

e.waitUntil(

caches.open(CACHE)
.then(cache => cache.addAll(ASSETS))

);

self.skipWaiting();

});

self.addEventListener('activate', e => {

e.waitUntil(

caches.keys().then(keys =>

Promise.all(

keys.map(key => {

if(key !== CACHE){

return caches.delete(key);

}

})

)

)

);

clients.claim();

});

self.addEventListener('fetch', e => {

e.respondWith(

fetch(e.request)

.catch(() => caches.match(e.request))

);

});
