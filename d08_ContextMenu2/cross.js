/**
 * Created by mjj on 16/12/21.
 */
function concatCross(default_suggest, ad, min) {
  var isArray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) === '[object Array]';
    }
  if (!isArray(default_suggest) || !isArray(ad)) return;
  if (!default_suggest.length) {
    return []
  }
  var sugCopy = default_suggest.slice(),
    tmpArr = [],
    min = min || 10;
  for (var i = 0, len = ad.length; i < len; i++) {
    var ad_index = parseInt(ad[i]['ad_suggest_location']);
    if (!isNaN(ad_index)) {
      tmpArr[ad_index - 1 < 0 ? 0 : ad_index - 1] = ad[i];
    }
  }
  for (var i = 0; i < tmpArr.length; i++) {
    if (tmpArr[i] === void 0) {
      if (sugCopy.length) {
        tmpArr[i] = sugCopy.shift();
      } else {
        tmpArr.splice(i, 1);
        i--;
      }
    }
  }
  while (tmpArr.length < min && sugCopy.length > 0) {
    tmpArr.push(sugCopy.shift());
  }
  return tmpArr;
}

var arr1 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',];
var arr2 = [{index: 3}, {index: 7},{index: 2},{index: 5},{index:13}];

function newCross(a1, a2, min) {
  var count = 0;
  for (var i = 0; i < a2.length; i++) {
    var index = parseInt(a2[i]['index']);
    index = index ? index - 1 : index
    a1.splice(index, 0, a2[i]);
    count++;
  }
  return a1;
}


function sortArr(arr) {
  arr.sort(function (a, b) {
    return parseInt(a['index'] - b['index']);
  });
  return arr;
}
sortArr(arr2);
