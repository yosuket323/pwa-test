var cacheName = "pwa-test-v2";

// フェッチ時
self.addEventListener('fetch', function(e) {
    self.skipWaiting();

    e.respondWith(
        caches.match(e.request).then((r) => {
            console.log("[Service Worker] Fetching resource: " + e.request.url);
            return (
                r ||
                fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
                    console.log(
                    "[Service Worker] Caching new resource: " + e.request.url,
                    );
                    cache.put(e.request, response.clone());
                    return response;
                });
                })
            );
        }),
    );
})

// メッセージ発生時
self.addEventListener('message', function (event) {
    self.skipWaiting();
    console.log(event.data);
    self.registration.showNotification(event.data);
})

// プッシュ受け取り時
function receivePushNotification(event) {
    self.skipWaiting();
    var event_data = event.data.json();
    const options = {
        body: event_data.body,
        icon: event_data.icon,
        data: event_data.data,
    };
    event.waitUntil(this.registration.showNotification(event_data.title, options));
}
this.addEventListener("push", receivePushNotification);

// プッシュを開いたとき
function openPushNotification(event) {
    self.skipWaiting();
    event.notification.close();
    console.log(event);
    event.waitUntil(clients.openWindow(event.notification.data.link));
}
this.addEventListener("notificationclick", openPushNotification);

// キャッシュ
var contentToCache = [
  "/pwa-test/icon/logo64.png",
  "/pwa-test/icon/logo192.png",
  "/pwa-test/icon/logo512.png",
  "/pwa-test/index.html",
  "/pwa-test/pwa-test.webmanifest",
  "/pwa-test/pwa.js",
  "/pwa-test/sw.js",
  "/pwa-test/cached-pages/index.html",
  "/pwa-test/cached-pages/cached-image.png"
];

// install : キャッシュ登録
self.addEventListener("install", (e) => {
    console.log("[Service Worker] Install");
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log("[Service Worker] Caching all: app shell and content");
            return cache.addAll(contentToCache);
        }),
    );
});

// activate : 古いキャッシュを削除
self.addEventListener("activate", function (event) {
    event.waitUntil(
      (function () {
        caches.keys().then(function (oldCacheKeys) {
          oldCacheKeys
            .filter(function (key) {
              return key !== cacheName;
            })
            .map(function (key) {
              return caches.delete(key);
            });
        });
        clients.claim();
      })()
    );
});
