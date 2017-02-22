/**
 * Created by mjj on 17/1/22.
 */
chrome.runtime.onMessage.addListener(function (msg, render, response) {
    console.log(msg);

    localStorage.setItem('kk', 'kkk');

    response({
        code: 1,
        success: true
    })
});

function saveData() {

}