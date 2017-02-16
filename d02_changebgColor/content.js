var port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
    // We only accept messages from ourselves
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        console.log("Content script received: " + event.data.text);
        port.postMessage(event.data.text);
    }
}, false);
window.selfInfo = {
    name: "test_cont.js",
    info: "这是嵌入的信息"
};

// console.log(window);
// console.log('我是嵌入的JS');
// document.getElementById('sendMsg').innerText = '嵌入JS修改';
/*
    嵌入到页面中的JS，会被放置到一个特殊的隔离环境。与原来页面的JS的环境（或者作用域）是隔离的，但是对于与DOM是共享的！
    因此，无发访问页面中JS变量。可通过DOM传递数据。
*/
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
    alert(msg.ready);
    if (msg.ready === "ready") {
        // if (confirm('Do you want to capture the screen?')) {
        //     sendResponse({ download: "download" });
        // }
    }
});
