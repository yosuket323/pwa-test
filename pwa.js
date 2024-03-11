window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register("sw.js")
            .then(registration => console.log("registered", registration))
            .catch(error => console.log("error", error));
    }

    document.getElementById("register").addEventListener('click', onClickRegister);
    document.getElementById("send").addEventListener("click", onClickSend);
});

function onClickRegister() {
    if (!check_notification()) {
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission == "granted") {
            post_message("登録が完了しました。")
        }
        if (permission == "denied") {
            alert("通知が許可されませんでした");
        }
    });
}

function onClickSend() {
    if (!check_notification()) {
        return;
    }

    const permission = Notification.permission;
    if (permission == 'granted') {
        post_message("こんにちは")
    }
    if (permission == "denied") {
        alert("通知が許可されていません");
    }
}

function check_notification() {
    if (!('Notification') in window) {
        alert("このブラウザはプッシュ通知に非対応です");
        return false;
    }
    return true;
}

function post_message(str) {
    navigator.serviceWorker.ready.then(registration => {
        registration.active.postMessage(str);
    });
}
