// フェッチ時
self.addEventListener('fetch', function(e) {
    self.skipWaiting();
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
    const options = {
        body: event.data.text()
    };
    event.waitUntil(this.registration.showNotification("PWA test", options));
}
this.addEventListener("push", receivePushNotification);

// プッシュを開いたとき
function openPushNotification(event) {
    self.skipWaiting();
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}
this.addEventListener("notificationclick", openPushNotification);
