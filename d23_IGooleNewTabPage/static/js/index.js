/**
 * Created by mjj on 17/1/22.
 */

/*
 *   mySug 搜索类
 *   @Constructor
 *   @param {Object|JSON} opt  初始化选项
 *   @mySug.ipt - input 对象
 *   @mySug.maxNum - 显示的最大数量
 *   @mySug.interface - 接口
 *   @mySug.queryValue - 查询的内容
 *   @mySug.value - 查询内容
 *   @mySug.sugIndex - 列表被选中的下标
 *   @mySug.dataArray - 返回的数据
 *   @mySug.dataCache - 缓存
 *   @mySug.renderCallback - 渲染完成回调函数
 *   @mySug.selectCallback - 选中之后回调函数
 * */
define('index', function (require, exports, module) {
    var global = window,
        $ = jQuery,
        doc = window.document;
    var sInterface = 'https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su';
    var cacheType = {
        'MEMORY': 1,
        'COOKIE': 2,
        'LOCALSTORAGE': 3
    };
    var keyCode = require('lib:keyCode');
    var tClass = require('lib:toolClass');
    require('lib:jqCookie')(jQuery);

    function mySug(opt) {
        var that = this,
            opt = that.opts = opt || {};
        that.ipt = opt.ipt,
            that.maxNum = opt.maxNum || 10,
            that.interface = opt.interface || sInterface,
            that.queryValue = that.ipt && that.ipt.value || '',
            that.value = that.queryValue,
            that.sugIndex = -1,
            that.dataArray = [],
            that.dataCache = {},
            that.timer,
            that.state,
            that.isCache = !0,
            that.focusClassName = opt.focusClassName || '',
            that.sugSelectClassName = opt.sugSelectClass || '',
            that.wrap = opt.wrap || (that.ipt && that.ipt.parentNode) || doc,
            that.cacheType = opt.cacheType || cacheType.MEMORY,
            that.renderCallback = function () {
            },
            that.selectCallback = function () {
            },
            that.searchFail = opt.searchFail || function () {
                },
            that.suggListWrap = doc.querySelector('#sugglist');

        that.init(opt);
        return that.outInterface();
    }

    mySug.prototype = {
        /*更新搜索数据*/
        updateInitData: function (query) {

        },
        /*显示建议列表*/
        showSugg: function () {
            tClass.removeClass(this.suggListWrap.parentNode, 'hide');
        },
        /*隐藏建议列表*/
        hideSugg: function () {
            tClass.addClass(this.suggListWrap.parentNode, 'hide');
            this.sugIndex = -1;
        },
        /*渲染sugg列表*/
        renderSug: function () {
            var that = this;
            var container = this.suggListWrap;
            var sugglist = this.getCache(this.queryValue);
            if (sugglist) {
                container.innerHTML = _renderTmpl(sugglist);
                that.showSugg();
            } else {
                this.search(function (sugglist) {
                    container.innerHTML = _renderTmpl(sugglist);
                    that.showSugg();
                });
            }

            function _renderTmpl(data) {
                var sTmpl = '';
                for (var i = 0; i < that.maxNum; i++) {
                    sTmpl += '<li data-key="<%key%>" data-order="<%order%>"><%key%></li>'.replace(/<%key%>/g, data[i]).replace(/<%order%>/, i);
                }
                return sTmpl;
            }
        },
        /*保存缓存*/
        saveCache: function (key, value) {
            if (this.cacheType == cacheType.COOKIE) {
                var cache = JSON.parse(decodeURIComponent($.cookie('SUGGEST_HISTORY') || "{}"));
                cache[key] = value;
                $.cookie('SUGGEST_HISTORY', encodeURIComponent(JSON.stringify(cache)));
            } else if (this.cacheType == cacheType.LOCALSTORAGE) {
                var cache = JSON.parse(decodeURIComponent(global.localStorage.SUGGEST_HISTORY || "{}"));
                cache[key] = value;
                global.localStorage.SUGGEST_HISTORY = encodeURIComponent(JSON.stringify(cache));
            } else if (this.cacheType == cacheType.MEMORY) {
                this.dataCache[key] = value
            }
        },
        /*获取缓存*/
        getCache: function (key) {
            if (this.cacheType == cacheType.COOKIE) {
                var cache = JSON.parse(decodeURIComponent($.cookie('SUGGEST_HISTORY') || "{}"));
                return cache[key] || null;
            } else if (this.cacheType == cacheType.LOCALSTORAGE) {
                var cache = JSON.parse(decodeURIComponent(global.localStorage.SUGGEST_HISTORY || "{}"));
                return cache[key] || null;
            } else if (this.cacheType == cacheType.MEMORY) {
                return this.dataCache[key] || null;
            }
        },
        /*清空缓存*/
        clearCache: function () {
            this.dataCache = {};
        },
        /*检测数据变化 @mySug.check*/
        check: function (searchFlag) {
            var that = this,
                v = that.ipt.value.trim(),
                qV = that.queryValue;

            if (qV == v) {
                return false;
            } else {
                that.queryValue = v;
                that.renderSug();
                if (searchFlag) {
                    that.goSearchPage();
                }
            }
        },
        /*搜索*/
        search: function (cb) {
            var that = this;
            that.searching = !0;
            $.ajax({
                url: that.interface,
                type: 'get',
                data: {
                    wd: that.queryValue
                    // json: '1',
                    // sid: '1436_21119_18559_20718'
                },
                dataType: 'jsonp',
                jsonp: 'cb',
                success: function (data) {
                    if (data && data.s && data.s.length > 0) {
                        cb && cb(data.s);
                        that.saveCache(that.queryValue, data.s);
                    }
                },
                error: function (err) {
                    that.searchFail.apply(that, arguments);
                }
            }).done(function () {
                that.searching = !!0;
            });

        },
        /*改变样式*/
        changeIptFocusStyle: function (className, type) {
            if (type == 'focus') {
                tClass.addClass(this.wrap, className);
                tClass.addClass(doc.querySelector('#bg'), 'blur');
                tClass.addClass(doc.querySelector('#search'), 'active');
            } else {
                tClass.removeClass(this.wrap, className);
                tClass.removeClass(doc.querySelector('#bg'), 'blur');
                tClass.removeClass(doc.querySelector('#search'), 'active');
                this.hideSugg();
            }
        },
        /*改变列表选中样式*/
        changeSugState: function (direct, className) {
            if (tClass.hasClass(this.suggListWrap.parentNode, 'hide')) {
                return;
            }
            if (direct == 'down') {
                (this.sugIndex == this.maxNum - 1) ? this.sugIndex = 0 : this.sugIndex++;
            } else if (direct == 'up') {
                (this.sugIndex <= 0) ? this.sugIndex = this.maxNum - 1 : this.sugIndex--;
            }
            tClass.hightSelf(this.suggListWrap.children[this.sugIndex], className);
            this.ipt.value = this.suggListWrap.children[this.sugIndex].dataset['key'];
            // this.queryValue = this.suggListWrap.children[this.sugIndex].getAttribute('data-key');
        },
        /*跳转到搜索页面*/
        goSearchPage: function () {
            var that = this;
            var sToUrl = 'https://www.baidu.com/s?wd=';
            that.queryValue = that.ipt.value || this.queryValue;
            chrome.tabs.create({
                url: sToUrl + encodeURIComponent(that.queryValue),
                active: true
            }, function (tab) {
                that.ipt.value = '';
            });
        },
        /*初始化 @mySug.check*/
        init: function () {
            var that = this,
                ipt = that.ipt;
            $(ipt).on({
                'inputChange': function (ev, data) {
                    that.search();
                },
                'keydown': function (ev) {
                    var selectClassName = that.sugSelectClassName;
                    var keyName = (keyCode[ev.keyCode] || '').trim();
                    //that.check.apply(that, [false]);
                    switch (keyName) {
                        case 'enter':
                            that.goSearchPage();
                            return false;
                            break;
                        case 'down arrow':
                        case 'up arrow':
                            ev.preventDefault();
                            that.changeSugState(keyName.split(' ')[0], selectClassName);
                            // that.changeSugState('up', selectClassName);
                            break;
                    }
                },
                'keyup': function (ev) {
                    //TODO:kecode分离出去了
                    var ignoreKey = ['enter', 'down arrow', 'up arrow'];
                    if (ignoreKey.indexOf((keyCode[ev.keyCode] || '').trim()) == -1) {
                        that.check.apply(that, [false]);
                    }
                },
                'focus': function (ev) {
                    that.changeIptFocusStyle(that.focusClassName, ev.type);
                    if (that.ipt.value) {
                        $(that.ipt).trigger('inputChange');
                        $(that.ipt).trigger('keyup');
                    }
                },
                'blur': function (ev) {
                    that.queryValue = '';
                }
            });

            $(window).blur(function () {
                that.hideSugg();
                that.ipt.blur();
            });
            $(document).on('click', function (ev) {
                var oSelect = ev.target;
                if (oSelect && oSelect.tagName == 'LI' && oSelect.parentNode == that.suggListWrap) {
                    that.goSearchPage(oSelect.dataset['key']);
                } else if (oSelect == that.ipt) {

                } else {
                    that.changeIptFocusStyle(that.focusClassName, ev.type);
                }
                // alert(this.dataset['key']);
            });

        },
        /*外部调用接口*/
        outInterface: function () {
            var that = this;
            return that.ipt ? {
                on: function (sEv, cb) {
                    $(that.ipt).on.apply(that.ipt, arguments);
                },
                off: function (sEv, cb) {
                    $(that.ipt).off.apply(that.ipt, arguments);
                },
                setMaxNum: function (num) {
                    that.maxNum = num;
                },
                setFocusStyle: function (className) {
                    that.focusClassName = className || '';
                },
                setSelectClass: function (className) {
                    that.sugSelectClassName = className || '';
                },
                setCacheType: function (type) {
                    that.cacheType = type || cacheType.LOCALSTORAGE;
                }
            } : null;
        }
    };


    module.exports = mySug;
});
define('hardware', function () {
    var oWrap = document.querySelector('#bg');
    !function initHardware() {
        var sTmpl = '<div id="hardware" class="panel"><table>\
                <tr><th>CPU</th><td><%cpu%></td></tr>\
                <tr><th>System</th><td><%system%></td></tr>\
                <tr><th>Browser</th><td><%browser%></td></tr>\
                <tr><th>Kernel</th><td><%Kernel%></td></tr>\
            </table></div>';
        chrome.system.cpu.getInfo(function (cpu) {
            var detail = cpu.modelName.split(' ');
            var cpuName = detail[2] + '(' + detail[5] + ')';
            sTmpl = sTmpl.replace(/<%cpu%>/i, cpuName);
            oWrap.insertAdjacentHTML('afterBegin', sTmpl);
        });
        var UA = window.navigator.userAgent;
        var system = '',
            browser = '',
            kernel = '';
        if (system = UA.match(/Mac OS X ([\d_]*)/i)) {
            system = 'Mac OS ' + system[1]
        } else if (system = UA.match(/Windows NT ([\d\.]*)/i)) {
            system = 'Windows NT ' + system[1]
        } else {
            system = 'Unkown'
        }
        if (browser = UA.match(/chrome\/([\d\.]*)/i)) {
            browser = 'Chrome ' + browser[1];
        }
        if (kernel = UA.match(/AppleWebKit\/([\d\.]*)/i)) {
            kernel = 'WebKit ' + kernel[1]
        }
        sTmpl = sTmpl.replace(/<%system%>/i, system);
        sTmpl = sTmpl.replace(/<%browser%>/i, browser);
        sTmpl = sTmpl.replace(/<%Kernel%>/i, kernel);
    }();
})
/*右侧的导航功能*/
define('sidebar', function (require, exports, module) {
    var global = window,
        $ = jQuery,
        doc = window.document;
    var tClass = require('lib:toolClass');
    var rSide = doc.querySelector('#rsidebar');
    $('#setbtn').click(function () {
        tClass.toggleClass(this, 'active');
        tClass.toggleClass(rSide, 'show');
    });
    $('.tab').on('click', '.tabopt', function () {
        tClass.hightSelf(this, 'active');
        tClass.hightSelf(document.querySelector('.content-opt[data-content="' + this.dataset['content'] + '"]'), 'hide', true);
    });
});
define('bgAnimation', function () {
    //本来想模仿百度云盘首页大图效果,但是返现在chromium中有点卡顿,,chrome中却流畅.所以放弃.
});
define('init', function (require, exports, module) {
    var mySug = require('index');
    var sug = new mySug({
        ipt: document.querySelector('#swd'),
        focusClassName: 'active',
        sugSelectClass: 'active',
        cacheType: 3
    });
    /**/
    //toFixed 会四舍五入，
    // 实现requestAnimationFrame 时间可控制的一个思路。
    // 通过requestAnimationFrame 自身循环的事件间隔，判断与总时间的占比，
    var then = Date.now();
    var time = 1;
    var all = 0.512313123;
    var per = 0;
    var movId;
    var digits = ('' + all).split('.')[1].length - 2;
    digits = (digits < 0 || digits > 2) ? 0 : digits;
    function circlePercent() {
    };
    function myAnimation() {
        movId = requestAnimationFrame(myAnimation);
        var md = (Date.now() - then) / 1000;
        per += md * all / time;
        if (per >= all) {
            cancelAnimationFrame(movId);
            per = all;
        }

        then = Date.now();
        circlePercent(canvas, (per * 100).toFixed(0) + '%', per)
        if (per >= 0.3) {
            cancelAnimationFrame(movId);
        }
    }

    window.onload = function () {
        // myAnimation();
    }

    //产生随机的颜色
    //ctx.fillStyle = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);

});
//canvas 时钟

require(['init', 'sidebar', 'hardware','hefeng-weather']);
