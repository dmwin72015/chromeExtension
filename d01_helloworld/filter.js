//TODO:学习弹出窗口与页面进行交互

function hideThirdParty($goodlist, flag) {
    if (flag == 1) { //只显示jd
        $goodlist.find('li.gl-item').each(function() {
            if (!$(this).find('div.p-icons>img').length) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else if (flag == 2) { //只显示第三方
        $goodlist.find('li.gl-item').each(function() {
            if ($(this).find('div.p-icons>img').length) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    } else { //显示全部
        $goodlist.find('li.gl-item').show();
    }
}
var selectedStyle = {
        color: '#fff',
        background: "#e4393c",
        borderColor: "#e4393c"
    },
    normarlStyle = {
        color: '#666',
        background: "#fff",
        borderColor: "#ccc"
    };
var sHtml = '<a href="javascript:;" class="dongmin_self selected" data-status="0" id="all_product">显示所有</a><a href="javascript:;"  class="dongmin_self" data-status="1" id="jdSelf">显示JD自营</a><a href="javascript:;"  class="dongmin_self"  class="thridparty" data-status="2">显示第三方</a>';
var currStatus = 0;
$(function() {
    var $goodlist = $('#J_goodsList');
    $(document).scroll(function() {
        var myBtn = $('a.dongmin_self');
        if (myBtn.length <= 0) {
            $('div.f-sort').append(sHtml);
        }
        $('a.dongmin_self[data-status=' + currStatus + ']').css(selectedStyle);
        hideThirdParty($goodlist, currStatus);
    });
    $('div.f-sort').append(sHtml);
    $('div.f-sort').on('click', 'a.dongmin_self', function() {
        $(this).css(selectedStyle).addClass('selected').siblings().css(normarlStyle).removeClass('selected');
        hideThirdParty($goodlist, currStatus = $(this).data('status'));
    })
});
