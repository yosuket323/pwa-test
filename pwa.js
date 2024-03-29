// サービスワーカーの起動
window.addEventListener('load', () => {
    // service worker を登録し起動する
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register("sw.js")
            .then(registration => console.log("registered", registration))
            .catch(error => console.log("error", error));
    }
});

// プッシュ通知の許可、テスト送信
document.getElementById("register").addEventListener('click', onClickRegister);
document.getElementById("send").addEventListener("click", onClickSend);

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
registerInstallAppEvent(document.getElementById("add-button"));
function registerInstallAppEvent(elem) {
    console.log(elem)
    function installApp() {
        console.log("install button clicked.");
        if(elem.promptEvent){
            elem.promptEvent.prompt();
            elem.promptEvent.userChoice.then(function(choice){
                elem.style.display = "none";
                elem.promptEvent = null;
        });
      }
    }
    elem.addEventListener("click", installApp);
}

// ブラウザのプッシュサービスに登録する
function notification_subscribe() {
    const pushServerPublicKey = 'BPz672kOaQrLlbrw4eP3FoBYM1y5dVsl9BoJXdvjrqEuRQG3zGh2yLSvB_4PAuZH0GnDSRqb3-QMyuoMrDcnHms';
    return navigator.serviceWorker.ready.then(
        (serviceWorker) => {
        // subscribe and return the subscription
        return serviceWorker.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: pushServerPublicKey
        }).then(
        (subscription) => {
            // TODO: send subscription.endpoint to server
            console.log ("プッシュサービス 登録成功")
            console.log (subscription.toJSON())
            _showWebPushCommand (subscription.toJSON());
            return subscription;
        },
        (error) => {
            alert("プッシュサービス 登録失敗");
            alert(error);
        });
        }
    );
}
function _showWebPushCommand(subscriptionInfo)
{
    const command = [
        "auth = mailto:yosuket@leapcom365.com<br>",
        "公開鍵 = BPz672kOaQrLlbrw4eP3FoBYM1y5dVsl9BoJXdvjrqEuRQG3zGh2yLSvB_4PAuZH0GnDSRqb3-QMyuoMrDcnHms<br>",
        "秘密鍵 = Y02NiF4fVEHqtVQ_KcSbXOl9Y1iUGtkGGYR1ylQ6xlk<br>",
        "endpoint = " + subscriptionInfo.endpoint + "<br>",
        "p256dh = " + subscriptionInfo.keys.p256dh + "<br>",
        "auth = " + subscriptionInfo.keys.auth + "<br>",
    ];

    var text = "この内容で push.js の subscribers に登録してください:<br>";
    text += command.join(" ");

    console.log(text);

    document.getElementById("result_text").innerHTML = text;
}
