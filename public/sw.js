var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing Service Worker ...', event);

    // Дождаться выполнения скрипта
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Cache opened');

                /**
                 * Dev tools - Application - Cache Storage
                 */
                /**
                 * Тут кэшируется url!
                 * Так называемый пре кэш
                 * Но, нужно быть внимательным, если каких то файлов нет на сервере,
                 * то все сломается.
                 */
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/js/feed.js',
                    // '/src/js/promise.js',
                    // '/src/js/fetch.js',
                    '/src/js/material.min.js',

                    '/src/css/app.css',
                    '/src/css/feed.css',

                    '/src/images/main-image.jpg',

                    'https://fonts.googleapis.com/css?family=Roboto:400,700',
                    'https://fonts.googleapis.com/icon?family=Material+Icons',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',

                    'https://fonts.gstatic.com/s/materialicons/v41/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
                ]);

                cache.add('/src/js/app.js');
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating Service Worker ...', event);
    /**
     * Удаление не используемого кэша
     */
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(
                    function (key) {
                        if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                            console.log('[Service Worker] Removing old cache.', key);

                            return caches.delete(key);
                        }
                    }
                ));
            })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetching something ...', event);
    event.respondWith(
        /**
         * Проверить существует ли в кэше этот файл, если
         * да, то вернуть этот файл
         */
        caches
            .match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                } else {
                    /**
                     * В этом случае кэшируется все
                     */
                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function (cache) {
                                    cache.put(
                                        event.request.url,
                                        res.clone()
                                    );

                                    return res;
                                })
                        })
                        .catch(function (error) {

                        });
                }
            })
    );
});
