// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var min = 1;
var max = 4;
var current = min;

function updateIcon() {
    chrome.browserAction.setIcon({ path: "icon" + current + ".png" });
    current++;

    if (current > max)
        current = min;
}

chrome.browserAction.onClicked.addListener(updateIcon);
updateIcon();

/*
	调用到的两个方法：
	1. 扩展图标点击事件
		chrome.browserAction.onClicked
	2. 设置图标
		chrome.browserAction.setIcon
*/
