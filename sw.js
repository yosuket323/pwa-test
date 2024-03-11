self.addEventListener('fetch', function(e) {
    //空でOK
})

self.addEventListener('message', function (event) {
    console.log(event.data);
    self.registration.showNotification(event.data);
})

function receivePushNotification(event) {
    const options = {
        body: event.data.text()
    };
    event.waitUntil(this.registration.showNotification("PWA test", options));
}
this.addEventListener("push", receivePushNotification);

function openPushNotification(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}
this.addEventListener("notificationclick", openPushNotification);
