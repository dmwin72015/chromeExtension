// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.commands.onCommand.addListener(function(command) {
    console.log('onCommand event received for message: ', command);
});
/*
	触发事件的按键配置。
	自定义的按键没有设置，_execute_browser_action 、 _execute_page_action 设置成功
	TODO: why ????
	
*/