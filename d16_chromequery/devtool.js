// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


/*
 * 可以给开发这工具栏添加新功能,添加一个自定义的UI界面
 * */
var hasAddListener = false;

// chrome.runtime.onInstalled.addListener(function () {
//   createPanel("Test-DM", "test.html");
// });

if (!hasAddListener) {
  createPanel("Test-DM", "test.html");
}

/*
 * 创建一个和ELement统计的panel
 * TODO:目前没有生效?
 * DONE:参数传少了.
 * */
function createPanel(name, url) {

  chrome.devtools.panels.create(name, null, url, function (panel) {
    // code invoked on panel creation
    addListener(panel);
    hasAddListener = true;
  });

  function addListener(panel) {
    var bgConnection = chrome.runtime.connect({
      name: "devtools-page"
    });

    bgConnection.onMessage.addListener(function (msg) {
      if (msg && msg.from == "background") {
        console.log(msg.data.message);
      }
    });

    /*
     * TODO:这里的事件会多次触发? 没找到原因????
     * */
    panel.onShown.addListener(function (param) {
      //测试connection是否可以发送消息
      /*bgConnection.postMessage({
       from: "from-devtool",
       type: "connection",
       data: {
       name: '张三'
       }
       });*/
      // 给background.js发送消息(数据)
      chrome.runtime.sendMessage({
        from: "from-devtool",
        type: "runtime",
        tabId: chrome.devtools.inspectedWindow.tabId,
        panel: panel,
        data: {
          message: '我来了.....'
        }
      });
    });
    panel.onHidden.addListener(function () {
      // 给background.js发送消息(数据)
      chrome.runtime.sendMessage({
        from: "from-devtool",
        type: "runtime",
        tabId: chrome.devtools.inspectedWindow.tabId,
        panel: panel,
        data: {
          message: '我走了.....'
        }
      });
    })
  }
}


// The function below is executed in the context of the inspected page.
// 这里的$0,是Chrome的功能,表示最近选中的DOM元素.类似的还有$1,$2,$3,$4 .
// 表示最近五次选择过的DOM元素,如果不够五个就返回undefined.
var page_getProperties = function () {
  var data = window.jQuery && $0 ? jQuery.data($0) : {};
  // Make a shallow copy with a null prototype, so that sidebar does not
  // expose prototype.
  var props = Object.getOwnPropertyNames(data);
  var copy = {__proto__: null};
  for (var i = 0; i < props.length; ++i)
    copy[props[i]] = data[props[i]];
  return copy;
}

chrome.devtools.panels.elements.createSidebarPane("jQuery Properties", function (sidebar) {
  function updateElementProperties() {
    sidebar.setExpression("(" + page_getProperties.toString() + ")()");
  }

  updateElementProperties();
  chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
});