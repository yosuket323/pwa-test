// 通知の実装
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

// インストールボタンの実装
let deferredPrompt;
const addBtn = document.querySelector(".add-button");
addBtn.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {
    // Chrome 67以前のバージョンでプロンプトが自動的に表示されないようにする
    e.preventDefault();
    // 後で発生させることができるように、イベントを隠しておく。
    deferredPrompt = e;
    // ホーム画面に内側へ追加できることをユーザーに通知する UI の更新
    addBtn.style.display = "block";
    
    addBtn.addEventListener("click", (e) => {
        console.log("clicked");
        // A2HS ボタンを表示するユーザーインターフェイスを非表示にします。
        addBtn.style.display = "none";
        // プロンプトを表示
        deferredPrompt.prompt();
        // ユーザーがプロンプトに応答するのを待つ
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("ユーザーが A2HS プロンプトを受け入れました。");
            } else {
                console.log("ユーザーは A2HS のプロンプトを拒否しました。");
            }
            deferredPrompt = null;
        });
    });
});
