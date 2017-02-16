// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

console.log(chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT);

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

  if (info.selectionText) {
    var url = 'https://www.baidu.com/s?wd=' + info.selectionText;
    // chrome.tabs.update(tab.id, {url: url});
    chrome.tabs.create({
      windowId: tab.windowId, // 在那个窗口打开页面,默认是当前的.
      index: tab.index + 1,   // 窗口位置 从0 开始.
      active: true,           // 打开的新窗口是否是当前激活的窗口(你正在看的窗口),默认是true.
      url: url,               // 打开窗口的地址
      pinned: false,          // 是否固定标签页,也就是把标签固定在最前面,缩小tab的长度,只显示一个图标(如果有的话).默认是false.
      openerTabId: tab.id     // 指定从哪个tab打开当前的页面,如果指定了,打开的页面必须和指定的tab在同一个window(窗口)中,
    });
  }
}

// Create one test item for each context type.
var contexts = ["all", "page", "selection", "link", "editable", "image", "video", "audio", "browser_action", "page_action"];
var ids = [];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = context + "级菜单";
  var id = chrome.contextMenus.create({
    "title": title,
    "contexts": [context],
    "onclick": genericOnClick
  });
  ids.push({
    title: title,
    id: id
  });
  console.log(title, id);
}


// Create a parent item and two children.
//创建一个包含两个子级的父菜单
var parent = chrome.contextMenus.create({"title": "父菜单一"});
var child1 = chrome.contextMenus.create({
  "title": "子级一",
  "parentId": parent,
  "onclick": genericOnClick
});
var child2 = chrome.contextMenus.create({
  "title": "子级二",
  "parentId": parent,
  "onclick": genericOnClick
});

// Create some radio items.
// 创建单选项
function radioOnClick(info, tab) {
  console.log("radio item " + info.menuItemId +
    " was clicked (previous checked state was " +
    info.wasChecked + ")");
}
var radio1 = chrome.contextMenus.create({
  "title": "单选一",
  "type": "radio",
  "onclick": radioOnClick
});
var radio2 = chrome.contextMenus.create({
  "title": "单选二",
  "type": "radio",
  "onclick": radioOnClick
});

// Create some checkbox items.
// 创建复选项
function checkboxOnClick(info, tab) {
  console.log(JSON.stringify(info));
  console.log("checkbox item " + info.menuItemId +
    " was clicked, state is now: " + info.checked +
    "(previous state was " + info.wasChecked + ")");

}
var checkbox1 = chrome.contextMenus.create({
  "title": "复选一",
  "type": "checkbox",
  "onclick": checkboxOnClick
});
var checkbox2 = chrome.contextMenus.create({
  "title": "复选二",
  "type": "checkbox",
  "onclick": checkboxOnClick
});
console.log("checkbox1:" + checkbox1 + " checkbox2:" + checkbox2);


//显示所有菜单的ID
function showID() {
  for (var i = 0; i > ids.length; i++) {
    chrome.contextMenus.update(ids[i], {
      "title": ids[i].title + ":" + ids[i].id
    });
  }
}


// Intentionally create an invalid item, to show off error checking in the
// create callback.
// 以一个ID不存在的父级来创建子菜单.
// console.log("About to try creating an invalid item - an error about item 999 should show up");
console.log("尝试创建一个父ID为999的下次菜单,当前ID为999的菜单不一定存在,那么一定会有报错信息");
chrome.contextMenus.create({"title": "Oops", "parentId": 999}, function () {
  if (chrome.extension.lastError) {
    console.log("Got expected error: " + chrome.extension.lastError.message);
  }
});


function updateUrl(url) {
  chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.sendRequest(tab.id, {data: "url", keephistory: true}, function (response) {
      console.log(response);
    });
  });
}

/*
* 综述: 创建的菜单不一定是,每次再点击右键的时候显示,根据不同情况有不同的显示效果.
* 比如:image , link , editable 等等这写类型的菜单
* */