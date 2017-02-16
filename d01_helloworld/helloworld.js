//获取当前tab的url。
function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
        console.log(tabs);
        var tab = tabs[0],
            url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url);
    });
}

/*
    显示图片
*/
function showImage(url) {
    var oDiv = document.getElementById('status');
    var img = new Image();
    img.src = url;
    oDiv.appendChild(img);
}


/*
    去掉第三方的商品
*/

function hideThirdParty($goodlist, flag) {
    if (flag == 1) { //只显示jd
        $goodlist.find('li.gl-item').each(function() {
            if (!$(this).find('div.p-icons>img').length) {
                $(this).hide();
            }
        });
    } else if (flag == 2) { //只显示第三方
        $goodlist.find('li.gl-item').each(function() {
            if ($(this).find('div.p-icons>img').length) {
                $(this).hide();
            }
        });
    } else { //显示全部
        $goodlist.find('li.gl-item').show();
    }
}
// document.addEventListener('DOMContentLoaded', function() {
//     var url = 'http://www.jf258.com/uploads/2014-09-11/004619969.jpg';
//     showImage(url);
// });

$(function() {
    var $goodlist = $('#J_goodsList');
    // $('#wraper>a').click(function() {
    //     $(this).toggleClass('selected').siblings().removeClass('selected');
    //     hideThirdParty($goodlist, $(this).data('val'));
    // });
    // $(document).scroll(function() {
    //     var val = $('#wraper>a.selected').data('val');
    //     hideThirdParty($goodlist, val)
    // })

    $goodlist.on('click', 'a', function() {

    });
});
