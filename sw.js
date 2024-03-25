var cacheName = "pwa-test-v5";

// フェッチ時
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => {
          return response ? response : fetch(event.request);
        })
    );
  });

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
    "./",
    "./index.html",
    "./icon/logo64.png",
    "./icon/logo192.png",
    "./icon/logo512.png",
    "./cached-pages/index.html",
    "./cached-pages/cached-image.png"
];

// install : キャッシュ登録
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches
        .open(cacheName)
        .then((cache) => {
          return cache.addAll(contentToCache);
        })
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
