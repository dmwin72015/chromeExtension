/**
 * Created by mjj on 16/12/22.
 */
if (!chrome.cookies) {
  chrome.cookies = chrome.experimental.cookies;
}
var CRCK = chrome.cookies;
/*
 * 辅助Class,操作cookie
 * method : add remove reset sort  getCookiesByDomain getAll
 * */
function CookieCache() {
  this.ck = chrome.cookies;
  this._cookie = {};
  // this.init();
}
CookieCache.prototype = {
  init: function () {
    var that = this;
    this.ck.getAll({}, function (cookies) {
      if (!cookies || cookies.length < 0) return;
      var i = 0, len = cookies.length;
      for (; i < len; i++) {
        that.add(cookies[i]);
      }
    });
  },
  add: function (cookie) {
    if (!this._cookie[cookie.domain]) {
      this._cookie[cookie.domain] = [];
    }
    this._cookie[cookie.domain].push(cookie);
  },
  reset: function () {
    this._cookie = {};
  },
  sort: function (order) {

  },
  getCookiesByDomain: function (domain, fuzzy) {
    var arr = [];
    if (fuzzy) {
      var domains = this.getDomains(),
        i = 0,
        len = domains.length;
      for (; i < len; i++) {
        if (domains[i].match(new RegExp(domain))) {
          arr.push(this._cookie[domains[i]]);
        }
      }
    } else {
      arr = this._cookie[domain] || [];
    }
    return arr;
  },
  getAll: function () {
    return this._cookie;
  },
  getDomains: function () {
    return Object.keys(this._cookie);
  },
  removeCookie: function (cookie, cb) {
    var name = cookie.name, copy = null;
    removeCookie(cookie),
      this._cookie[cookie.domain].filter(function (cookie) {
        if (cookie.name == name) {
          copy = Object.assign(copy, cookie);
        }
        return cookie.name != name;
      });
    cb && cb(copy);
  },
  removeCookieByDomain: function (domain, buzzy, cb) {
    var domains = [];
    this.getCookiesByDomain(domain, buzzy).forEach(function (cookie) {
      if (cookie instanceof Array) {
        cookie.forEach(function (ele) {
          removeCookie(cookie);
        })
        domains.push(cookie.domain)
      } else {
        removeCookie(cookie);
      }
    });
    cb && cb(Object.assign(copy, this.getCookiesByDomain(domain)));
    if (domains.length) {
      domains.forEach(function (domain) {
        delete this._cookie[domain];
      })
    } else {
      delete this._cookie[domain];
    }
  },
  removeAll: function (cb) {
    var that = this;
    that.getDomains().forEach(function (domain) {
      that.removeCookieByDomain(domain);
    });
    that.reset();
    cb && cb();
  }
};

/**
 * TODO: 完成一个分页标签
 * @Date 2016-12-27
 * @Time 18:24
 * @Author dongmin
 * @
 * *****************************/

function Page(option) {
  return this.init.call(this, arguments[0]);
}
Page.prototype = {
  showData: function (pageNum) {

  },
  getTotalSize: function () {
    return this.data.getDomains().length;
  },
  init: function (option) {
    //分页数据
    this.currentPageNum = isNumber(option.currentPageNum) || 1;
    this.pageSize = isNumber(option.pageSize) || 10;
    this.data = option.datasrc || ckCache;
    this.maxPageNum = Math.ceil(this.getTotalSize() / this.pageSize);
    //显示数量
    this.moreShowNum = 9;
    this.lessShowNum = 3;
    this.maxShowNum = this.moreShowNum + this.lessShowNum;
    //缓存
    this.cache = {};

    //页面结构
    this.htmlBuff = [];

    //容器
    this.wraper = option.wraper || (function () {
        var div = document.createElement('div');
        document.body.appendChild(div);
        return div;
      })();
    this.addEvent();
  },
  createDom: function (pageNum) {
    var buff = [],
      total = this.getTotalSize(),
      maxPageNum = this.maxPageNum,
      nMore = this.moreShowNum,
      nLess = this.lessShowNum;
    pageNum = pageNum || this.currentPageNum;

    // buff.push('<div class="section page" id="page">');
    buff.push('<a href="javascript:;" class="prev ' + (pageNum == 1 ? 'unable' : '') + '">PREV</a>');

    if (pageNum <= maxPageNum) {/* 页面总数 < 设置的最大显示数量 */

      for (var i = 1; i <= maxPageNum; i++) {
        buff.push('<a href="javascript:;"' + (i == pageNum ? 'class="curr"' : '') + '>' + i + '</a>');
      }

    } else {/* 页面总数 >= 设置的最大显示数量 */

      if (maxPageNum - pageNum < nMore) {/* 页数到结尾,< nMore [小于设置的最多显示页码数] */

        //省略前
        for (var j = 1; i <= nLess; j++) {
          buff.push('<a href="javascript:;>' + j + '</a>');
        }

        //省略部分
        buff.push('<div class="omitted"><span>.....</span><div class="all-page"><div class="inner-content">');
        for (; j <= maxPageNum - nMore; j++) {
          buf.push('<span>' + j + '</span>');
        }
        buff.push('</div></div>');

        //省略后
        for (var i = nMore - 1; i >= 1; i--) {
          buff.push('<a href="javascript:;"' + (maxPageNum - i == pageNum ? 'class="curr"' : '') + '>' + (maxPageNum - i) + '</a>');
        }

      } else { /* 没到结尾 */
        var refer = Math.floor(nMore / 2);
        //省略前
        if (pageNum <= Math.ceil(More / 2)) {

          for (var i = 1; i <= nMore; i++) {
            buff.push('<a href="javascript:;"' + (i == pageNum ? 'class="curr"' : '') + '>' + i + '</a>')
          }

        } else {
          for (var i = pageNum - refer; i <= pageNum + refer; i++) {
            buff.push('<a href="javascript:;"' + (i == pageNum ? 'class="curr"' : '') + '>' + i + '</a>')
          }
        }

        //省略部分
        buff.push('<div class="omitted"><span>.....</span><div class="all-page"><div class="inner-content">');
        for (var i = pageNum + refer + 1; j <= maxPageNum - nLess; j++) {
          buf.push('<span>' + j + '</span>');
        }
        buff.push('</div></div>');

        //省略后
        for (var j = maxPageNum - nLess + 1; j <= maxPageNum; j++) {
          buff.push('<a href="javascript:;>' + j + '</a>');
        }
      }
    }

    buff.push('<a href="javascript:;" class="next ' + (pageNum == maxPageNum ? 'unable' : '') + '">NEXT</a>');
    // buff.push('</div>');

    this.cacheDom('page-' + pageNum, buff.join(''));
    this.currentPageNum = pageNum;
    return this.cache['page-' + pageNum];
  },
  showPage: function (pageNum) {
    this.wraper.innerHTML = this.cache['page-' + pageNum] || this.createDom(pageNum || 1);

    var currPageNum = this.currentPageNum,
      pageSize = this.pageSize;

    var startIndex = pageSize * (currPageNum -1);
        domains = this.data.getDomains().slice(startIndex,startIndex + pageSize);
    loadTable_tmpl(domains);


  },
  addEvent: function () {
    var that = this;
    this.wraper.addEventListener('click', function (ev) {
      var target = ev.target;
      if (target.tagName == 'A') {
        var classList = target.classList;
        if (classList.contains('unable')) {
          return false;
        } else if (classList.contains('prev')) {
          if (that.currentPageNum > 1) {
            that.showPage(that.currentPageNum - 1);
          }
        } else if (classList.contains('next')) {
          if (that.currentPageNum < that.maxPageNum) {
            that.showPage(that.currentPageNum + 1);
          }
        } else {
          that.showPage(parseInt(target.innerText));
        }
      }
    });
  },
  cacheDom: function (pageNum, dom) {
    this.cache[pageNum] = dom;
    return this;
  },
  clearCache: function () {
    this.cache = {};
    return this;
  },
  clearBuff: function () {
    this.htmlBuff.length = [];
  }
};

function isNumber(num) {
  if (typeof num == 'number') {
    return num;
  }
}
var ckCache = new CookieCache();


/********************************/
//对比cookie,判断cookie是否是同一个
function cookieMatch(c1, c2) {
  return (c1.name == c2.name) && (c1.domain == c2.domain) &&
    (c1.hostOnly == c2.hostOnly) && (c1.path == c2.path) &&
    (c1.secure == c2.secure) && (c1.httpOnly == c2.httpOnly) &&
    (c1.session == c2.session) && (c1.storeId == c2.storeId);
}

//获取某一个domain的所有cookie
function getDomainCookie(domain, buzzy) {
  return ckCache.getCookiesByDomain(domain, buzzy);
}

// 删除cookie
function removeCookie(cookie) {
  var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain +
    cookie.path;
  chrome.cookies.remove({"url": url, "name": cookie.name});
}

//删除某一个domain下的所有cookie
function removeCookiesForDomain(domain, buzzy, cb) {
  if (arguments.length == 3) {
    ckCache.removeCookieByDomain(domain, buzzy, cb);
  } else if (arguments.length == 2) {
    ckCache.removeCookieByDomain(domain, buzzy);
  } else if (arguments.length == 1) {
    ckCache.removeCookieByDomain(domain, false);
  }
}

//删除所有的cookie
function removeAllCookies(cb) {
  ckCache.removeAll(cb);
}

/**********************************************/

// 生成表格,方式一 (创建DOM)
function loadTable(sTmpl, oTable) {
  var oTable = document.getElementById('contentTable');
  var fragment = document.createDocumentFragment(),
    allCookie = ckCache.getAll(),
    domains = Object.keys(allCookie);

  for (var i = 0, dlen = domains.length; i < dlen; i++) {
    var tr = document.createElement('tr');
    var cookies = allCookie[domains[i]],
      oAlen = '<a href="javascript:;" class="cookie-num" data-domain="' + domains[i] + '">' + cookies.length + '</a>',
      oDelBtn = '<input type="button" class="btn" value="删除">';
    [domains[i], oAlen, oDelBtn].forEach(function (ele, index) {
      var td = document.createElement("td");
      td.innerHTML = ele;
      tr.appendChild(td);
    });
    fragment.appendChild(tr);
  }
  oTable.appendChild(fragment);
}

// 生成表格,方式二 (使用模板)
function loadTable_tmpl(order_domains) {
  var sTmpl = document.getElementById('td_tmpl').innerHTML;
  var oTable = document.getElementById('contentTable'),
    tbody = oTable.getElementsByTagName('tbody')[0];
  if (tbody) {
    tbody.innerHTML = '';
  } else {
    tbody = document.createElement('tbody');
  }
  var fragment = document.createDocumentFragment(),
    allCookie = ckCache.getAll(),
    domains = order_domains || Object.keys(allCookie)
  aHtml = [];
  for (var i = 0, dlen = domains.length; i < dlen; i++) {
    aHtml.push(sTmpl.replace(/\{%index\%}/g, i + 1).replace(/\{%domain%\}/g, domains[i].domain || domains[i]).replace(/\{%num%\}/g, (allCookie[domains[i]] || allCookie[domains[i]['domain']]).length));
  }

  tbody.innerHTML = aHtml.join('');
  fragment.appendChild(tbody);
  oTable.appendChild(fragment);
}




// 根据cookie数量对表格排序
function reOrderTable(order, filter) {
  var allCookie = ckCache.getAll(),
    domains = Object.keys(allCookie),
    orderArr = [];
  for (var i = 0, dlen = domains.length; i < dlen; i++) {
    orderArr.push({
      domain: domains[i],
      cookieLen: allCookie[domains[i]].length
    })
  }
  orderArr.sort(function (a, b) {
    return order ? a.cookieLen - b.cookieLen : b.cookieLen - a.cookieLen;
  });
  return orderArr;
}

// 查询cookie
function filterDomain(word, order) {
  var allCookie = ckCache.getAll(),
    domains = Object.keys(allCookie),
    orderArr = [];
  for (var i = 0, dlen = domains.length; i < dlen; i++) {
    if (new RegExp(word, 'ig').test(domains[i])) {
      orderArr.push({
        domain: domains[i],
        cookieLen: allCookie[domains[i]].length
      })
    }
  }
  orderArr.sort(function (a, b) {
    return order ? a.cookieLen - b.cookieLen : b.cookieLen - a.cookieLen;
  });
  return orderArr;
}

//获取所有cookie,并缓存到ckCache对象中
function getAllCookie(cb) {
  CRCK.getAll({}, function (cookies) {
    if (!cookies || cookies.length < 0) return;
    var i = 0, len = cookies.length;
    for (; i < len; i++) {
      ckCache.add(cookies[i]);
    }
    cb && cb();
  });
}


//弹出cookie的详细信息
function showDetail(domain) {
  var cookies = getDomainCookie(domain);
  var sDetailTmpl = document.getElementById('popup_detail_tmpl').innerHTML,
    sTdTmpl = document.getElementById('td_tmpl_cookie').innerHTML;
  var aHtml = [];
  for (var i = 0, len = cookies.length; i < len; i++) {
    aHtml.push(sTdTmpl
      .replace(/\{%index%\}/g, i + 1)
      .replace(/\{%name%\}/g, cookies[i].name)
      .replace(/\{%value%\}/g, cookies[i].value)
      .replace(/\{%path%\}/g, cookies[i].path)
      .replace(/\{%expires%\}/g, cookies[i].expirationDate ? formatTime(cookies[i].expirationDate) : (cookies[i].session ? 'session' : ''))
      .replace(/\{%size%\}/g, cookies[i].value.length)
      .replace(/\{%http%\}/g, cookies[i].httpOnly ? "是" : "否")
      .replace(/\{%secure%\}/g, cookies[i].secure ? "是" : "否")
    );
  }
  $('body').addClass('modal-active').append(sDetailTmpl.replace(/\{%domain%\}/g, domain).replace(/\{%content%\}/g, aHtml.join('')));
  $('.mask').show().css('opacity', "0.4");
}
//关闭弹出框
function hideDetail() {
  $('body').removeClass('modal-active');
  $('.cookie-content').remove();
  $('.mask').css('opacity', "0").hide();
}

//格式化时间
function formatTime(time) {
  var date = new Date(parseFloat(time) * 1000);
  if (!isNaN(date.getTime())) {
    return formatDate(date);
  }
  return '未知';
}


//TODO:Cookie为什么文档加载完成之后才能获取??
// chrome提供的API获取cookie是异步
document.addEventListener('DOMContentLoaded', function () {
  getAllCookie(function () {
    initPage();
  });

  $(document).on('click', 'input.btn.detail,.cookie-num', function () {
    var domain = $(this).parents('tr').eq(0).data('domain');
    showDetail(domain);
    $('.cookie-content').removeClass('hide');
  });

  $(document).on('click', '.close,.mask', function () {
    hideDetail();
  });

  $(document).on('click', '.del_single_cookie', function () {
    delCookie();
  });

  $(document).on('click', '.cookie-num-title', function () {
    if ($(this).find('i').hasClass('down')) {
      var order = true, oldClass = 'down', newClass = 'up';
    } else {
      var order = false, oldClass = 'up', newClass = 'down';
    }
    $(this).find('i').removeClass(oldClass).addClass(newClass);
    loadTable_tmpl(reOrderTable(order));
  });

  $('#keyword').on('keyup', function () {
    var that = this;
    var curr_time = new Date().getTime(),
      last_time = that.lastTime;
    that.lastTime = curr_time;
    if (curr_time - last_time < 300) {
      clearTimeout(that.timer);
    }
    that.timer = setTimeout(function () {
      console.log('c查询......');
      var order = $('.cookie-num-title>i').hasClass('down') ? false : true,
        words = that.value.trim();
      loadTable_tmpl(filterDomain(words, order))
    }, 300);
  });
  //删除所有cookie,重绘表格
  $('#clearAll').click(function () {
    removeAllCookies(function () {
      loadTable_tmpl();
    });
  });

  function createTable() {
    loadTable_tmpl(reOrderTable(false));
  }


  //TODO: 测试分页
  function initPage() {
    var ckPage = new Page({
      wraper: document.getElementById('page')
    });
    ckPage.showPage();
    console.log(ckPage);
  }

});

// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//author: meizz
function formatDate(oDate, fmt) {
  fmt = fmt || "yyyy-MM-dd hh:mm:ss";
  var o = {
    "M+": oDate.getMonth() + 1,                 //月份
    "d+": oDate.getDate(),                    //日
    "h+": oDate.getHours(),                   //小时
    "m+": oDate.getMinutes(),                 //分
    "s+": oDate.getSeconds(),                 //秒
    "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
    "S": oDate.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/*
 * 翻页
 * */
