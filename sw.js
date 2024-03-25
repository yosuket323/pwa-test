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
    var event_data = event.data.json();
    const options = {
        body: event_data.body,
        icon: event_data.icon,
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
