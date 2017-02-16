/**
 * Created by mjj on 17/1/10.
 */
function $(fn) {
    document.handles = document.handles || [];
    if (document.handles.length == 0) {
        document.addEventListener('DOMContentLoaded', _handle, false);
    }
    document.handles.push(fn);
    function _handle(ev) {
        var i = 0, arr = document.handles, len = arr.length;
        for (; i < len; i++) {
            arr[i].call(document, ev);
        }
    }
}

$(function () {
    var v = 0.01,
        reqId;

    function moving() {
        if (v >= 1) {
            cancelAnimationFrame(reqId);
            return;
        }
        var oDownlaod = document.getElementById('downloading');
        oDownlaod.querySelector('.moving').style.webkitTransform = "scaleX(" + (v += 0.01) + ")";
        reqId = requestAnimationFrame(moving);
    }

    // requestAnimationFrame(moving);
});
$(function () {

    var sTmpl = document.getElementById('tmpl_done').innerHTML;
    var oWrap = document.querySelector('#downlist>dl');
    formatDownLoadData({orderBy: ['-startTime']}, sTmpl, function (tmpl) {
        appendHtml(oWrap, tmpl);
    })
});


function formatDownLoadData(query, sTmpl, fn) {
    var aHtmlTmpl = [];
    chrome.downloads.search(query, function (res) {
        if (!res || !res.length)  return;
        var i = 0, len = res.length;
        for (; i < len; i++) {
            aHtmlTmpl.push(renderTmpl(filterData(res[i]), sTmpl));
        }
        fn(aHtmlTmpl.join(''));
    });
}
function filterData(downitem) {
    var obj = {
        id: downitem.id,
        downUrl: downitem.finalUrl,
        size: formateBytes(downitem.totalBytes || 0),

        state: downitem.state,
        path: downitem.filename || '',
        danger: downitem.danger
    };
    if (downitem.filename) {
        var res = downitem.filename.split('/');
        obj.filename = res[res.length - 1];
    }
    if (downitem.mime) {
        var res = downitem.mime.split('/');
        obj.filetype = res[res.length - 1];
    }
    // var startTime = new Date(downitem.startTime).getTime(),
    //     endTime = new Date(downitem.endTime).getTime();
    var startTime = Date.parse(downitem.startTime),
        endTime = Date.parse(downitem.endTime);
    if (!isNaN(startTime) && !isNaN(endTime)) {
        obj.startTime = new Date(startTime).toSource();
        obj.endTime = new Date(endTime).toSource();
    } else {
        obj.endTime = obj.startTime || '';
    }

    if (downitem.state == 'interrupted') {
        obj.duration = '下载未完成';
        obj.endTime = new Date(startTime).toSource() || '';

    } else {
        obj.duration = formateTime(endTime - startTime);
    }

    if ('10' == downitem.id) {
        console.dir(downitem);
    }
    if ('13' == obj.id) {
        console.dir(obj);
    }
    return obj;
}

function formateTime(time) {
    if (time < 1000) return '1s';
    var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;
    var value = [day, hour, minute, second];
    var unit = 'dhms', res = '';
    for (var i = 0; i < value.length; i++) {
        if (time > value[i]) {
            res += parseInt(time / value[i]) + unit[i];
            time = time % value[i]
        }
    }
    return res;
}

function formateBytes(n, decimal) {
    "use strict";
    if (n < 1024) return n + 'B';
    var prefixes = 'KMGTPEZY';
    var unit = 1024,
        mul = 1024;
    var decm = ('' + decimal).match(/^\d{1}$/g) ? Math.pow(10, parseInt(decimal)) : 10;
    for (var i = 0; i < prefixes.length; i++) {
        if (n < (unit * mul)) {
            return parseInt(n / mul) + '.' + parseInt(decm * ((n / mul) % 1)) + prefixes[i] + 'B';
        }
        mul *= unit;
    }
}

function renderTmpl(data, tmpl) {
    tmpl = tmpl.trim();
    tmpl = tmpl.replace(/\{\$id\}/g, data.id)
        .replace(/\{\$fileType\}/g, data.filetype)
        .replace(/\{\$name\}/g, data.filename)
        .replace(/\{\$data_size\}/g, data.size)
        .replace(/\{\$url\}/g, data.downUrl)
        .replace(/\{\$endTime\}/g, data.endTime)
        // .replace(/\{\$endTime\}/g, data.id)
        .replace(/\{\$I18n_endTime\}/g, data.endTime)
        .replace(/\{\$I18n_period\}/g, data.duration)
        .replace(/\{\$period\}/g, data.duration);//12<small>h</small>5<small>m</small>16<small>s</small>
    return tmpl;
}
/*在obj里 底部 添加html*/
function appendHtml(obj, html) {
    obj.insertAdjacentHTML('beforeend', html);
}
/*在obj里 顶部 添加html*/
function insertHtml(obj, html) {
    obj.insertAdjacentHTML('afterbegin', html);
}
/*在obj外 后面 添加html*/
function after(obj, html) {
    obj.insertAdjacentHTML('afterend', html);
}
/*在obj外 前面 添加html*/
function before(obj, html) {
    obj.insertAdjacentHTML('beforebegin', html);
}
/*
 * element.insertAdjacentHTML(position, text);
 position 是相对于 element 元素的位置，并且只能是以下的字符串之一：

 beforebegin：在 element 元素的前面。
 afterbegin：在 element 元素的第一个子节点前面。
 beforeend：在 element 元素的最后一个子节点后面。
 afterend：在 element 元素的后面。
 text 是字符串，会被解析成 HTML 或 XML，并插入到 DOM 树中。
 * */
/**$(function () {
    //简单刮奖
    function createCanvas(parent, w, h) {
        var canvas = {};
        parent = parent || document;
        canvas.ele = document.createElement('canvas');
        canvas.context = canvas.ele.getContext('2d');
        canvas.ele.width = w || (parent != document ? parent.offsetWidth : 180);
        canvas.ele.height = h || (parent != document ? parent.offsetHeight : 40);

        parent.appendChild(canvas.ele);
        return canvas;
    }

    function init(parent, w, h) {
        var canvas = createCanvas(parent, w, h);
        var ctx = canvas.context;

        canvas.fillCircle = function (x, y, radius, color) {
            var ctx = this.context;
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(x, y);
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.fill();
            console.log('drawing......', x, y);
        };

        canvas.clearTo = function (color) {
            var ctx = this.context;
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, this.ele.width, this.ele.height);
        };

        canvas.clearTo("#696868");//绘制整个颜色

        if (browser.isMobile()) {
            var sBeginEv = 'touchstart', sEndEv = 'touchend', sMoveEv = 'touchmove';
        } else {
            var sBeginEv = 'mousedown', sEndEv = 'mouseup', sMoveEv = 'mousemove';
        }
        canvas.ele.addEventListener(sBeginEv, function () {
            canvas.isDrawing = true;
        }, false);
        canvas.ele.addEventListener(sEndEv, function () {
            canvas.isDrawing = false;
        }, false);
        canvas.ele.addEventListener(sMoveEv, function (ev) {
            if (!canvas.isDrawing) {
                return;
            }
            if (browser.versions.android) {
                var x = ev.changedTouches[0].pageX - this.offsetLeft;
                var y = ev.changedTouches[0].pageY - this.offsetTop;
            } else {
                var x = ev.pageX - this.parentNode.offsetLeft;
                var y = ev.pageY - this.parentNode.offsetTop;
            }

            var radius = 5;
            var color = '#ff0000';
            canvas.context.globalCompositeOperation = 'destination-out';
            canvas.fillCircle(x, y, radius, color);
        }, false);


    }

    var browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.\*Mobile.\*\/),   //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),    //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1,   //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1,       //是否iPad
                webApp: u.indexOf('Safari') == -1   //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
        isMobile: function () {
            return (browser.versions.mobile || browser.versions.ios || browser.versions.android ||
            browser.versions.iPhone || browser.versions.iPad)
        },
        isPC: function () {
            return !this.isMobile();
        }
    }
    var parent = document.querySelector('#reward');
    init(parent);
});**/

// 重写toSource方法
Date.prototype.toSource = function (format) {
    format = format || 'yyyy-MM-dd hh:mm';
    var month = this.getMonth() + 1,
        day = this.getDate(),
        hour = this.getHours(),
        second = this.getSeconds();
    return format.replace(/y+/, this.getFullYear())
        .replace(/M+/, month < 10 ? '0' + month : month)
        .replace(/d+/, day < 10 ? '0' + day : day)
        .replace(/h+/, hour < 10 ? '0' + hour : hour)
        .replace(/m+/, second < 10 ? '0' + second : second);
}