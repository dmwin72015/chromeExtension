define('colorClock', function(require, exports, module) {
    var global = window,
        $ = jQuery,
        doc = window.document;
    var tool = require('lib:toolClass');
    var GLOBAL_W = global.innerWidth,
        GLOBAL_H = global.innerHeight,
        MAR_T = 250,
        MAR_L = 200;
    /***
        基础参数
        ballRadius  小圆半径
        digit       时钟图形地图数组
        colors      需要的所有颜色  注：第一个为时钟的，其他为随机的彩色小球
        ballMargin  小球之间的距离
        ballPadding 整个数字之间的距离
        rowNum      数字小球的行数
    ***/
    var digit = [ // 数字
        [
            [0, 0, 1, 1, 1, 0, 0],
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 0, 1, 1, 0],
            [0, 0, 1, 1, 1, 0, 0]
        ],
        [
            [0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ],
        [
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
        ],
        [
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 0],
            [0, 1, 1, 0, 1, 1, 0],
            [1, 1, 0, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1]
        ],
        [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]

        ],
        [
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0],
            [1, 1, 0, 0, 0, 0, 0],
            [1, 1, 0, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
        ],
        [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0]
        ], //7
        [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 0]
        ], //8
        [
            [0, 1, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 1, 1],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 0, 0, 0]
        ], //9
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ] //:
    ];
    var COLORS = ["#FFF", "#33B5E5", "#0099CC", "#AA66CC", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000", '#FF9900', '#FFCC00', '#66CCCC', '#FF6666', '#99CC66'];
    var numCols = [7, 7, 4, 7, 7, 4, 7, 7]; //每个数字的列数
    var ballRadius = 8;
    var ballMargin = 2;
    var ballPadding = 5;
    var rowNum = digit[0].length;


    //设置clock的位置
    var canvas = $('#clock')[0];
    canvas.width = GLOBAL_W;
    canvas.height = GLOBAL_H;

    //返回时间字符串，格式: 时时 : 分分 :秒秒
    function getDateStr() {
        var oD = new Date();
        var hour = oD.getHours();
        var minute = oD.getMinutes();
        var second = oD.getSeconds();
        var str = '' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
        return {
            h: hour,
            m: minute,
            s: second,
            ms: oD.getTime(),
            str: str
        }
    }
    /********    
        保存离屏画布 思路二  
        保存每一个数字 以及冒号（:）的canvas ，当做缓存，下次使用，直接获取，不需要每次来绘制。
    ************/
    var OFF_CANVAS = {}; //offCanvasNew
    var numRowsNew = 10;
    var numColsNew = [7, 7, 4, 7, 7, 4, 7, 7]; //时 ：分 ：秒的列数,
    var DATE_NUMBER_LOC = []; // 时 ：分 ：秒 的位置numberPosition
    var DATE_INDEX = { h1: 0, h2: 1, p1: 2, m1: 3, m2: 4, p2: 5, s1: 6, s2: 7, length: 8 };
    //初始化时分秒的坐标以及大小
    function initClockNumLocNew() {
        for (var i = 0; i < numColsNew.length; i++) {
            DATE_NUMBER_LOC[i] = {
                w: calcWidth(numColsNew[i]),
                h: calcHeight(numRowsNew),
                x: DATE_NUMBER_LOC[i - 1] ? (DATE_NUMBER_LOC[i - 1].x + DATE_NUMBER_LOC[i - 1].w) : MAR_L,
                y: MAR_T
            }
        }
    }
    initClockNumLocNew();
    //初始化所有离屏的canvas
    function initOffCanvasNew(num) {
        for (var i = 0; i < digit.length; i++) {
            var tmp = {};
            tmp.canvas = document.createElement('canvas')
            tmp.numBallMap = calcBallsMap(digit[i]);
            tmp.w = calcWidth(i < 10 ? numColsNew[0] : numColsNew[1]);
            tmp.h = calcHeight(numRowsNew);
            tmp.canvas.width = tmp.w;
            tmp.canvas.height = tmp.h;
            tmp.style = COLORS[6];
            OFF_CANVAS[i] = drawNumberOffCanvas(tmp);
        }

        //根据digit数组算出需要绘制小球的位置（相当于计算出小球地图，每个数字对应一个。包括冒号）
        function calcBallsMap(map, style) {
            var arr = [];
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    if (map[i][j] == 1) {
                        arr.push({
                            x: ballPadding + ballRadius * (2 * j + 1) + ballMargin * j,
                            y: ballPadding + ballRadius * (2 * i + 1) + ballMargin * i,
                            r: ballRadius,
                            color: style || COLORS[3]
                        });
                    }
                }
            }
            return arr.slice();
        }
        //绘制离屏的canvas，下次调用直接获取即可，不需要重新计算
        function drawNumberOffCanvas(canvas_wrap) {
            var canvas = canvas_wrap.canvas;
            var ctx = canvas.getContext('2d');
            var numBallMap = canvas_wrap.numBallMap;
            ctx.fillStyle = canvas_wrap.style;
            ctx.beginPath();
            for (var i = 0; i < numBallMap.length; i++) {
                ctx.moveTo(numBallMap[i].x + numBallMap[i].r, numBallMap[i].y);
                ctx.arc(numBallMap[i].x, numBallMap[i].y, numBallMap[i].r, 0, 2 * Math.PI);
            }
            ctx.closePath();
            ctx.fill();
            canvas_wrap.hasDraw = true;
            return canvas_wrap;
        }
    }
    //计算每个数字的高度、宽度
    function calcWidth(ballnum) {
        return ballPadding * 2 + (ballnum - 1) * ballMargin + ballnum * ballRadius * 2;
    }

    function calcHeight(rows) {
        return ballPadding * 2 + (rows - 1) * ballMargin + rows * ballRadius * 2;
    }
    initOffCanvasNew();
    function renderAll() {
        var cvs = $('#clock')[0],
            ctx = cvs.getContext('2d');
        var preOD = getDateStr(),
            preStr = preOD.str,
            preSecond = preOD.s,
            preMinute = preOD.m,
            preHour = preOD.h,
            preMs = preOD.ms;
        //绘制普通小球
        function drawNumber(num, pos, isClear) {
            if (isClear) {
                ctx.clearRect(DATE_NUMBER_LOC[pos].x, DATE_NUMBER_LOC[pos].y, DATE_NUMBER_LOC[pos].w, DATE_NUMBER_LOC[pos].h);
            }
            ctx.drawImage(OFF_CANVAS[num].canvas, DATE_NUMBER_LOC[pos].x, DATE_NUMBER_LOC[pos].y);
        }
        //添加彩色小球之后，放弃使用定时器。使用requestAnimationFrame
        var colorBalls = [];

        function addColorBall(num, index) {
            var numBallMap = OFF_CANVAS[num].numBallMap;
            for (var i = 0; i < numBallMap.length; i++) {
                colorBalls.push({
                    x: DATE_NUMBER_LOC[index].x + numBallMap[i].x,
                    y: DATE_NUMBER_LOC[index].y + numBallMap[i].y,
                    r: numBallMap[i].r,
                    color: COLORS[tool.randomInt(1, COLORS.length - 1)],
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //结果为-4/4
                    vy: -5
                })
            }
        }
        //跟新彩色小球的位置
        function updateColorBall(t) {
            var w = cvs.width,
                h = cvs.height,
                g = 9.8;
            for (var i = 0; i < colorBalls.length; i++) {
                var ball = colorBalls[i];
                ball.x += ball.vx;
                ball.y += ball.vy;
                ball.vy += ball.g;
                if (ball.y + ball.r >= w) {
                    ball.y = h - ball.r;
                    ball.vy = -ball.vy * 0.6;
                }
                if (ball.x - ball.r <= 50 || ball.x + ball.r >= w - 50) {
                    colorBalls.splice(i, 1);
                    i--;
                }
            }
        }

        function drawColorBall() {
            for (var i = 0, len = colorBalls.length; i < len; i++) {
                ctx.beginPath();
                ctx.fillStyle = colorBalls[i].color;
                ctx.arc(colorBalls[i].x, colorBalls[i].y, colorBalls[i].r, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
        }
        //跟新小球的位置
        function updateColorsBallsTest() {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            for (var i = 0; i < colorBalls.length; i++) {
                colorBalls[i].x += colorBalls[i].vx;
                colorBalls[i].y += colorBalls[i].vy;
                colorBalls[i].vy += colorBalls[i].g;
                if (colorBalls[i].y + colorBalls[i].r >= GLOBAL_H) {
                    colorBalls[i].y = GLOBAL_H - colorBalls[i].r;
                    colorBalls[i].vy = -colorBalls[i].vy * 0.6;
                }
                if (colorBalls[i].x - colorBalls[i].r <= 50 || colorBalls[i].x + colorBalls[i].r >= GLOBAL_W - 50) {
                    colorBalls.splice(i, 1);
                    i--;
                }
            }
        }
        //方式一： 使用 requestAnimationFrame 循环
        ~function intervalFrame() {
            var currOD = getDateStr(),
                currStr = currOD.str,
                currSecond = currOD.s,
                currMinute = currOD.m,
                currHour = currOD.h;
            // ctx.clearRect(0, 0, cvs.width, cvs.height);
            for (var i = 0; i < currStr.length; i++) {
                var num = isNaN(currStr.charAt(i) - 0) ? 10 : currStr.charAt(i) - 0;
                drawNumber(num, i, false);
            }
            if (preSecond != currSecond) {
                addColorBall(parseInt(currStr.charAt(DATE_INDEX.s2)), DATE_INDEX.s2);
                //判断 小时 第一位
                if (parseInt(currHour / 10) != parseInt(preHour / 10)) {
                    addColorBall(parseInt(currHour / 10), DATE_INDEX.h1);
                }
                //判断 小时 第二位
                if (h2 = parseInt(currHour % 10) != parseInt(preHour % 10)) {
                    addColorBall(parseInt(currHour % 10), DATE_INDEX.h2);
                }
                //判断 分钟 第一位
                if (parseInt(currMinute / 10) != parseInt(preMinute / 10)) {
                    addColorBall(parseInt(currMinute / 10), DATE_INDEX.m1);
                }
                //判断 分钟 第二位
                if (parseInt(currMinute % 10) != parseInt(preMinute % 10)) {
                    addColorBall(parseInt(currMinute % 10), DATE_INDEX.m2);
                }
                //判断 秒钟 第一位
                if (parseInt(currSecond / 10) != parseInt(preSecond / 10)) {
                    addColorBall(parseInt(currSecond / 10), DATE_INDEX.s1);
                }
            }
            preSecond = currSecond;
            preMinute = currMinute;
            preHour = currHour;
            preMs = currOD.ms;
            drawColorBall();
            updateColorsBallsTest();
            // req = requestAnimationFrame(intervalFrame);
            // if (colorBalls.length > 50) {
            //     console.log(colorBalls);
            //     cancelAnimationFrame(req);
            // }
        }();
        // intervalFrame();
        //方式二：定时器，（性能不太好）
        /*var timer = setInterval(function() {
            var currOD = getDateStr(),
                currStr = currOD.str,
                currSecond = currOD.s,
                currMinute = currOD.m,
                currHour = currOD.h;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            for (var i = 0; i < currStr.length; i++) {
                var num = isNaN(currStr.charAt(i) - 0) ? 10 : currStr.charAt(i) - 0;
                // drawNumber(num, i, false);
            }

            if (preSecond != currSecond) {
                addColorBall(parseInt(currStr.charAt(DATE_INDEX.s2)), DATE_INDEX.s2);
                //判断 小时 第一位
                if (parseInt(currHour / 10) != parseInt(preHour / 10)) {
                    addColorBall(parseInt(currHour / 10), DATE_INDEX.h1);
                }
                //判断 小时 第二位
                if (h2 = parseInt(currHour % 10) != parseInt(preHour % 10)) {
                    addColorBall(parseInt(currHour % 10), DATE_INDEX.h2);
                }
                //判断 分钟 第一位
                if (parseInt(currMinute / 10) != parseInt(preMinute / 10)) {
                    addColorBall(parseInt(currMinute / 10), DATE_INDEX.m1);
                }
                //判断 分钟 第二位
                if (parseInt(currMinute % 10) != parseInt(preMinute % 10)) {
                    addColorBall(parseInt(currMinute % 10), DATE_INDEX.m2);
                }
                //判断 秒钟 第一位
                if (parseInt(currSecond / 10) != parseInt(preSecond / 10)) {
                    addColorBall(parseInt(currSecond / 10), DATE_INDEX.s1);
                }
            }
            preSecond = currSecond;
            preMinute = currMinute;
            preHour = currHour;
            drawColorBall();
            // updateColorBall(currOD.ms - preMs);
            updateColorsBalls();
            console.log(colorBalls);
            clearInterval(timer);
        }, 1000);*/
    }

    renderAll();

    // 没有添加彩色小球时的方案
    /* 
        对于时间变化判断的问题：
        1.用判断时、分、秒第二位为0 ，但是如果添加断点调试没就会出现，跳过判断的问题
        2.使用动画小球时不太友好，需要调整定时器的事件间隔，但是调整事件间隔之后也可能会出现【1】中问题。
        所以放弃使用这种方案
    */
    /*window.setInterval(function() {
        var tmp = getDateStr(),
            second = tmp.s,
            minute = tmp.m,
            str = tmp.src;
        if (second == 0) { // 判断秒为0 ，重新绘制分钟
            if (str.charAt(DATE_INDEX.m2) == '0') {
                drawNumber(parseInt(str.charAt(DATE_INDEX.m1)), DATE_INDEX.m1, true);
            }
            drawNumber(parseInt(str.charAt(DATE_INDEX.m2)), DATE_INDEX.m2, true);
        }
        if (minute == 0) { // 判断分钟为0 ，重新绘制小时
            if (str.charAt(DATE_INDEX.h2) == '0') {
                drawNumber(parseInt(str.charAt(DATE_INDEX.h1)), DATE_INDEX.h1, true);
            }
            drawNumber(parseInt(str.charAt(DATE_INDEX.h2)), DATE_INDEX.h2, true);
        }
        if (str.charAt(DATE_INDEX.s2) == '0') {
            drawNumber(parseInt(str.charAt(DATE_INDEX.s1)), DATE_INDEX.s1, true);
        }
        drawNumber(parseInt(str.charAt(DATE_INDEX.s2)), DATE_INDEX.s2, true);
    }, 1000);*/
});
