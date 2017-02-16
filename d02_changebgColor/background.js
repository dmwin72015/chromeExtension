// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// Called when the user clicks on the browser action.
//console.log(new Date().toLocaleString());

// var ch_BA = chrome.browserAction;
// ch_BA.onClicked.addListener(function(tab) {
//     // No tabs or host permissions needed!
//     console.log('Turning ' + tab.url + ' red!');
//     chrome.tabs.executeScript({
//         code: 'document.body.style.backgroundColor="red"'
//     });

// });


var greeting = 'hello world';

chrome.tabs.query({
    active: true,
    currentWindow: true
}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { ready: "no_ready" }, function(rep) {
    	
    });
});

/*
	TODO: 在manifest.json中设置了content_scripts。就无法触发browserAction的click事件了？？？
	Answer: from http://stackoverflow.com/questions/1938356/chrome-browser-action-click-not-working
		You need delete the popup.html, you already have a popup in popup.html in theory the background.html should do the event for browserAction but is wrong. When you clicked in the Icon of you app there's already defined an function onClicked in popup.
	大体意思：
		在 mainfest.json中配置了"default_popup": "popup.html"。
		理论上，应该响应在chrome.browserAction.onClicked上添加的事件。
		但是你错了。你点击图标的时候，已经定义了一个函数来响应onClicked，
	个人观点
		个人感觉是覆盖了
*/
function getDomainFromUrl(url) {
    var host = "null";
    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match)
        host = match[1];
    return host;
}

function checkForValidUrl(tabId, changeInfo, tab) {
    if (getDomainFromUrl(tab.url).toLowerCase().match("fis.com") && changeInfo.status == "complete") {
        chrome.pageAction.show(tabId);
        chrome.pageAction.setIcon({
            tabId: tabId,
            path: "cnblogs_19.png"
        }, function(data) {
            console.log(arguments);
        });
        chrome.pageAction.setTitle({
            title: "去死吧",
            tabId: tabId
        });
    }
};

chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.pageAction.onClicked.addListener(function(tab) {
    console.log(tab.title);
})
