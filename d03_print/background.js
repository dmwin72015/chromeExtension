/*
	1. 给按钮添加点击事件
		chrome.browserAction.onClicked.addListener 
	2. 改变当前tab的链接（地址栏里的url地址）
		chrome.tabs.update
*/

chrome.browserAction.onClicked.addListener(function(tab) {
    // var action_url = "javascript:window.print();";
    var action_url = "http://www.baidu.com";
    chrome.tabs.update(tab.id, { url: action_url });
});
