self.addEventListener('fetch', function(e) {
    //空でOK
})

self.addEventListener('message', function (event) {
    console.log(event.data);
    self.registration.showNotification(event.data);
})

function receivePushNotification(event) {
    const options = {
      data: "データ",
      body: "内容",
    };
    event.waitUntil(this.registration.showNotification("タイトル", options));
}
this.addEventListener("push", receivePushNotification);
  
function openPushNotification(event) {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}
this.addEventListener("notificationclick", openPushNotification);
