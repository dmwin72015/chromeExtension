function click(e) {
    chrome.tabs.executeScript(null, {
        code: "document.body.style.backgroundColor='" + e.target.id + "'"
    });
    // window.close();
}

function addEvent(obj, type, handler, useCapture) {
    if (typeof handler != 'function' || typeof type != 'string') {
        return;
    }
    var evHandlers = obj.evHandlers || {};
    evHandlers[type] = evHandlers[type] || [];

    if (evHandlers[type] && !evHandlers[type].length) {
        obj.addEventListener(type, _run, useCapture || false)
    }

    evHandlers[type].push(handler);

    function _run(ev) {
        var arrHandler = evHandlers[type],
            len = arrHandler.length;
        for (var i = 0; i < len; i++) {
            arrHandler[i].call(obj, ev);
        }
    }
}

function ready(fn) {
    if (typeof fn == 'function') {
        addEvent(document, 'DOMContentLoaded', fn);
    }
}
document.addEventListener('DOMContentLoaded', function() {
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
        divs[i].addEventListener('click', click);
    }
});
ready(function() {
    var sendBtn = document.getElementById('btn');
    addEvent(sendBtn, 'click', function() {
        console.log(chrome.browserAction);
    });
});
ready(function() {
    var bg = chrome.extension.getBackgroundPage();
    console.log(bg);
});
