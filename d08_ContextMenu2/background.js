// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT = 10;
// TODO: 没发现用处,限制顶级最大菜单数量.


/*
* 这个demo和d07_ContextMenu的区别就是,是否配置"persistent": false,
* 也就是说,时候是Event Page.
* 在Event Page中,如要创建右键菜单必须手动传入指定ID.
* */
var MENU_LIST = [{
  name: ''
}];
// The onClicked callback function.
function onClickHandler(info, tab) {

  if (info.menuItemId == "radio1" || info.menuItemId == "radio2") {
    console.log("radio item " + info.menuItemId + " was clicked (previous checked state was " + info.wasChecked + ")");
  } else if (info.menuItemId == "checkbox1" || info.menuItemId == "checkbox2") {
    console.log(JSON.stringify(info));
    console.log("checkbox item " + info.menuItemId +
      " was clicked, state is now: " + info.checked +
      " (previous state was " + info.wasChecked + ")");

  } else {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
  }
};
//TODO:获取菜单的名字
function updateMenuName(info, tab) {
  chrome.contextMenus.update(info.menuItemId, {
    title: info.menuItemId
  })
}


chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
// 安装时创建这些菜单选项,只有插件被安装的时候调用,也就是说只会调用一次.
// 因为baackground.js 是Event Page 所以必须传入ID.来创建一个右键菜单项
//"persistent": false, 是否持续在后台运行
chrome.runtime.onInstalled.addListener(function () {
  // Create one test item for each context type.
  var contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
  for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Test '" + context + "' menu item";
    var id = chrome.contextMenus.create({
      "title": title,
      "contexts": [context],
      "id": "context" + context
    });
    console.log("'" + context + "' item:" + id);
  }

  // Create a parent item and two children.
  chrome.contextMenus.create({
    "title": "父级",
    "id": "parent"
  });
  chrome.contextMenus.create({
    "title": "孩子1",
    "parentId": "parent",
    "id": "child1"
  });
  chrome.contextMenus.create({
    "title": "孩子2",
    "parentId": "parent",
    "id": "child2"
  });

  // Create some radio items.创建单选菜单
  chrome.contextMenus.create({
    "title": "单选-男",
    "type": "radio",
    "id": "radio1"
  });
  chrome.contextMenus.create({
    "title": "单选-女",
    "type": "radio",
    "id": "radio2"
  });

  // Create some checkbox items.创建复选菜单
  chrome.contextMenus.create({
    "title": "复选-足球",
    "type": "checkbox",
    "id": "checkbox1"
  });
  chrome.contextMenus.create({
    "title": "复选-篮球",
    "type": "checkbox",
    "id": "checkbox2"
  });
  chrome.contextMenus.create({
    "title": "复选-羽毛球",
    "type": "checkbox"
    // "id": "checkbox3"
  });

  for (var i = 0; i < 10; i++) {
    var id = chrome.contextMenus.create({
      "title": '数量' + i,
      "contexts": ['browser_action'],
      "id": "caidan_" + i
    });
    console.log(id);
  }

  // Intentionally create an invalid item, to show off error checking in the
  // create callback.
  // console.log("About to try creating an invalid item - an error about duplicate item child1 should show up");
  // chrome.contextMenus.create({"title": "Oops", "id": "child1"}, function () {
  //   if (chrome.extension.lastError) {
  //     console.log("Got expected error: " + chrome.extension.lastError.message);
  //   }
  // });
});

// chrome.tabs.getCurrent调用只能在content.js中,如果在背景页面(background.js)或者是弹出页面(manage.js)中则可能是未定义.
function showIcon(tab) {
  var url = tab.url || '',
    id = tab.id;
  if (url.match(/^https?:\/\/.*\.chrome\.com\/.*/i)) {
    chrome.pageAction.show(id);
  }
}
// tab跟新时触发,例如:调用chrome.tabs.update 刷新页面 使用JS改变title,都会触发.
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    console.log(tab)
    showIcon(tab);
  }
});
chrome.pageAction.onClicked.addListener(function (tab) {
  toggleMutedTab(tab);
});

function toggleMutedTab(tab, cb) {
  var muted = false;
  if (!tab.mutedInfo.muted) {
    muted = true;
  }
  chrome.tabs.update(tab.id, {
    muted: muted//静音
    // pinned: true//固定标签
  }, function () {
    cb && cb();
  });
}
