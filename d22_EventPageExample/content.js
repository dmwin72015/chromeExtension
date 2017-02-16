/**
 * Created by mjj on 17/1/22.
 */
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

document.body.innerHTML = "";

function addButton(name, cb) {
    var a = document.createElement("button");
    a.innerText = name;
    a.onclick = cb;
    document.body.appendChild(document.createElement("br"));
    document.body.appendChild(a);
}

function log(str) {
    console.log(str);
    logDiv.innerHTML += str + "<br>";
}

addButton("清楚日志", function() {
    logDiv.innerHTML = "";
});

addButton("发送延迟回复消息", function() {
    chrome.runtime.sendMessage({delayedResponse: true}, function(response) {
        log("Background page responded: " + response);
    });
});

addButton("显示计数", function() {
    chrome.runtime.sendMessage({getCounters: true}, function(response) {
        log("In-memory counter is: " + response.counter);
        log("Persisted counter is: " + response.persistentCounter);
    });
});

addButton("设置闹铃", function() {
    chrome.runtime.sendMessage({setAlarm: true});
});

chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
    log("后来获取的消息: " + msg);
});

var logDiv = document.createElement("div");
logDiv.style.border = "1px dashed black";
document.body.appendChild(document.createElement("br"));
document.body.appendChild(logDiv);

log("Ready.");