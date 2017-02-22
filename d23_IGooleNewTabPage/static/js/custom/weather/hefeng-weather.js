/**
 * Created by mjj on 17/2/22.
 */
define('hefeng-weather', function (require, exports, module) {
    var $ = jQuery.noConflict();
    var cityData = require('cityData');
    var weatherData = require('weatherData');

    var api = {
        url_x3: 'https://free-api.heweather.com/x3/',
        url_v5: 'https://free-api.heweather.com/v5/',
        key: '459d7a6e2dac47d8860af917801c0dd2'
    };
    var type = {
        'citySearch': 'search',
        'sevenDay': 'forecast',
        'weather': 'weather',
        'now': 'now'
    };
    var queryInfo = {
        key: api.key,
        city: 'beijing',
        lang: 'zh-cn'
    };

    $.ajax({
        url: api.url_v5 + type.now,
        data: queryInfo,
        success: function (data) {
            console.log(data);
        }

    })
});