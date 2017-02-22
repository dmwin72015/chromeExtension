/**
 * Created by mjj on 17/2/20.
 */
define('weather', function (require, exports, module) {
    var $ = jQuery.noConflict();
    //省、市、镇 参数
    var config = {
        prov: {
            grade: 'province'
        },
        city: {
            grade: 'city',
            code: ''
        },
        town: {
            grade: 'town',
            code: ''
        },
        weather: {
            url: '',
            data: {
                code: '',
                t: (new Date).getTime(),
                c: (new Date).getTime()
            }
        },
        cn_Unicode: ['\u5e74', '\u6708', '\u65e5', '\u661f', '\u671f', '\u5468', '\u4eca', '\u660e', '\u540e', '\u5929'],
        cn_week: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"]
    };
    //通用获取数据方法
    function getData(json, cb) {
        if ($.isEmptyObject(json)) return;
        $.ajax({
            url: json.url || 'http://cdn.weather.hao.360.cn/sed_api_area_query.php',
            data: json.data || json,
            dataType: 'jsonp',
            jsonp: '_jsonp',
            success: function (data) {
                data = $.isArray(data) ? data : eval('(' + data + ')');
                cb && cb(data);
            }
        });
    }

    var $provinceList = $('#provinceList'), $cityList = $('#cityList'), $townList = $('#townList');
    var $province = $('#province'), $city = $('#city'), $town = $('#town');
    //点击省份
    $provinceList.on('click', 'span', function (ev) {
        var _this = $(this);
        $cityList.html('');
        _this.addClass('on').siblings().removeClass('on');
        $province.text(_this.text());
        getCityList(_this.attr('data-num'));
    });
    //点击城市
    $cityList.on('click', 'span', function (ev) {
        $townList.html('');
        $(this).addClass('on').siblings().removeClass('on');
        $city.text($(this).text());
        config.town.code = $(this).attr('data-num');
        getTownList($(this).attr('data-num'))
    });
    //点击城镇
    $townList.on('click', 'span', function (ev) {
        var _this = $(this);
        _this.addClass('on').siblings().removeClass('on');
        $town.text(_this.text());
        getWeather(_this.attr('data-num'), showWeather);
    });

    //显示省份列表
    function getProvinceList(cb) {
        getData(config.prov, function (data) {
            var str = '';
            for (var n = 0; n < data.length; n++) {
                str += '<span class="' + (n == 0 ? 'on' : '') + '"\n data-num="' + data[n][1] + '">' + data[n][0] + '</span>';
            }
            $provinceList.append($(str));
            $province.text(data[0][0]);
            cb ? cb() : getCityList(data[0][1]);
        });
    }

    //显示城市列表
    function getCityList(pCode) {
        $cityList.html(''),
            config.city.code = pCode || config.city.code;
        getData(config.city, function (data) {
            $city.text(data[0][0]);
            var str = '';
            for (var n = 0; n < data.length; n++) {
                str += '<span class="' + (n == 0 ? 'on' : '') + '"\n data-num="' + data[n][1] + '">' + data[n][0] + '</span>';
            }
            $cityList.append($(str));
            $city.text(data[0][0]);
            getTownList(data[0][1]);
        })
    }

    //显示城镇列表
    function getTownList(cCode) {
        $townList.html(''),
            config.town.code = cCode || config.town.code;
        getData(config.town, function (data) {
            var str = '';
            for (var n = 0; n < data.length; n++) {
                str += '<span class="' + (n == 0 ? 'on' : '') + '"\n data-num="' + data[n][1] + '">' + data[n][0] + '</span>';
            }
            $townList.append($(str));
            $town.text(data[0][0]);
            getWeather(data[0][1], showWeather);
        })
    }

    //获取天气数据
    function codeselect(tCode) {
        //360 添加的两个参数，一个是当前时间的毫秒值，一个是毫秒值+城镇的code
        var currTime = (new Date).getTime(),
            handTime = parseInt(tCode) + (new Date).getTime(),
            result = [currTime, handTime];
        return result;
    }

    function getWeather(tCode, cb) {
        var param = codeselect(tCode);
        $.ajax("http://tq.360.cn/api/weatherquery/querys?app=tq360", {
            dataType: "jsonp",
            jsonp: "_jsonp",
            data: {
                code: tCode,
                t: param[0],
                c: param[1]
            },
            success: function (data) {
                cb && cb(data);
            },
            error: function (data) {
                cb && cb(data);
            }
        });
    }

    //显示天气
    function showWeather(data) {
        showRealTimeWea(data);
        showFutureWea(data.weather);
        showChart(data);

    }

    //显示实时天气
    function showRealTimeWea(data) {
        var pm25 = data.pm25;
        var realData = data.realtime;
        var oDate = new Date();
        oDate.setTime(parseInt(realData.dataUptime) * 1000);
        var temp = realData.weather.temperature;
        var hour = oDate.getHours();
        var minu = oDate.getMinutes();
        $('.currentTemperature').html('<span class="num">' + temp + '</span><span class="Symbol">℃</span>');
        $('.time').text((hour < 10 ? '0' + hour : hour) + ':' + (minu < 10 ? '0' + minu : minu) + '跟新');
        $('.ther-ball').css('height', temp / 30 * 65 + 110 + 'px');
        $('.pm25').text(data.pm25.aqi ? 'PM:' + data.pm25.aqi : '空气优');
    }

    //显示未来五天天气
    function showFutureWea(data) {
        if (data.length <= 0) return;
        var cn_Unicode = $.extend([], config.cn_Unicode);
        var cn_week = $.extend([], config.cn_week);
        var str = '<h3>${wea_date}</h3><p class="big-icon ${wea_icon}"></p><p class="summary">${wea_summary}</p><p class="sky">${wea_sky}</p><p class="temp"><span>${wea_temp}</span><em>℃</em></p> <p class="win">${wea_wind}</p><p>日出${sun_up}/日落${sun_down}</p>';
        var aWeatherList = $('.everyday');
        for (var n = 0; n < data.length; n++) {
            var sDate = getDateStr(n, data[n].date),
                oInfo = data[n].info,
                sSumm_day = oInfo.day[1],
                sSumm_night = oInfo.night[1],
                sSummAll = sSumm_day == sSumm_night ? sSumm_day : sSumm_day + '\u8f6c' + sSumm_night,
                nTemp_day = parseInt(oInfo.day[2]),
                nTemp_night = parseInt(oInfo.night[2]),
                sTemp = nTemp_day > nTemp_night ? nTemp_night + '~' + nTemp_day : nTemp_day + '~' + nTemp_night,
                sWind = oInfo.day[4];
            var res = str.replace(/\$\{wea_date\}/, sDate).replace(/\$\{\s*wea_icon\s*\}/, '').replace(/\$\{\s*wea_summary\s*\}/, sSummAll).replace(/\$\{\s*wea_sky\s*\}/, '').replace(/\$\{\s*wea_temp\s*\}/, sTemp).replace(/\$\{\s*wea_wind\s*\}/, sWind).replace(/\$\{\s*sun_up\s*\}/, oInfo.day[5]).replace(/\$\{\s*sun_down\s*\}/, oInfo.night[5]);
            aWeatherList.eq(n).html('').append($(res));
        }
        function getDateStr(n, str) {
            var stmp = '',
                aDate = str.split('-'),
                nYear = parseInt(aDate[0]),
                nMonth = parseInt(aDate[1]),
                nDay = parseInt(aDate[2]),
                oCurrDate = new Date(nYear, nMonth - 1, nDay);
            switch (n) {
                case 0:
                    stmp = cn_Unicode[6] + cn_Unicode[9];
                    break;
                case 1:
                    stmp = cn_Unicode[7] + cn_Unicode[9];
                    break;
                case 2:
                    stmp = cn_Unicode[8] + cn_Unicode[9];
                    break;
                default:
                    stmp = cn_Unicode[3] + cn_Unicode[4] + cn_week[oCurrDate.getDay()];
                    break;
            }
            return stmp + '(' + nMonth + '-' + nDay + ')';
        }
    }

    //显示温度曲线
    var oCan = document.getElementById('hours_temp');

    function showChart(data) {
        console.log(data);
        data = data || {};
        var aHourData = data.hourly_forecast;
        var aHour = [];
        var aTemp = [];
        var aInfo = [];
        for (var n = 0; n < aHourData.length; n++) {
            aHour.push(aHourData[n].hour == 0 ? '明天' : aHourData[n].hour + 'h');
            aTemp.push(parseInt(aHourData[n].temperature));
            aInfo.push(aHourData[n].info);
        }
        $('#hours_temp').highcharts({
            chart: {
                type: 'line'
            },
            title: {
                text: '未来24小时温度变化'
            },
            xAxis: {
                categories: aHour
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 10,
                    label: {
                        text: 10,
                        x: -30
                    },
                    width: 1,
                    color: 'rgb(216, 216, 216)'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            series: [{
                name: '温度',
                data: aTemp
            }],
            credits: {
                enabled: false
            }
        });
    }


    $(function () {
        var data = {
            "url": "http://cdn.weather.hao.360.cn/sed_api_area_query.php",
            param: {
                "grade": "province",
                "_jsonp": "loadProvince"
            }
        };

        function exeFn(fnString) {
            function loadProvince(data) {
                console.log(data);
                window.localStorage.setItem('citys', JSON.stringify(data));
                var msg = {
                    data: data,
                    action: 'save',
                    location: 'localstorage'
                };

            }

            // new Function('return ' + fnString)();
            chrome.runtime.sendMessage(msg, function (cbData) {

            });
        }

        function sendMessage(data) {
            var msg = {
                data: data,
                action: 'save',
                location: 'localstorage'
            };
            localStorage.setItem('index','dddddd');
            chrome.runtime.sendMessage(msg, function (cbData) {
                console.log(cbData);
                console.log(localStorage);
            });
        }

        function getProvinceData() {
            $.ajax({
                url: data.url,
                type: 'get',
                data: data.param,
                success: function (data) {
                    if (data.charAt(data.length - 1) == ';') {
                        data = data.slice(0, data.length - 1);
                    }
                    // var res = exeFn(data);
                    sendMessage(data);
                },
                error: function (data) {
                    console.log(data)
                }
            });
        }

        getProvinceData();

    })
});