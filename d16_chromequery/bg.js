chrome.runtime.onConnect.addListener(function (devToolsConnection) {

  console.log(devToolsConnection);

  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function (message, sender, sendResponse) {

    console.log(message);

  };

  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function () {

    devToolsConnection.onMessage.removeListener(devToolsListener);

  });

  //利用连接(connection)发送数据
  devToolsConnection.postMessage({
    from: "background",
    type: "connection",
    code: 100,
    data: {
      message: "连接成功...."
    }
  });

  // 利用runtime的sendMessage()  .onMessage.addListener() 可以实现数据的传递
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.from == 'from-devtool') {
      console.log(msg);
    } else {
      console.log('无法识别的消息来源.....');
    }
  });
});