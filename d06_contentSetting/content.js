/**
 * Created by mjj on 16/12/20.
 */
document.addEventListener('DOMContentLoaded', function () {
  alert('a');
  chrome.tabs.getCurrent(function (tab) {
    console.log(tab);
  });
}, false);
console.log(document.getElementById('method-getCurrent'));
console.log(chrome);