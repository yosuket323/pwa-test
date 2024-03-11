self.addEventListener('fetch', function(e) {
    //空でOK
})

self.addEventListener('message', function (event) {
    console.log(event.data);
    self.registration.showNotification(event.data);
})
