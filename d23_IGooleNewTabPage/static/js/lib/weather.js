/*
	@description
	这个demo是从网上的一个电子时钟，改变借鉴（其实就是抄）过来的，但是并不是照搬过来的，
	我个人改进的地方：（不一定对）
	1、将时、分、秒、冒号分为不同的canvas
	   理由：原来的例子，是放在了同一个canvas上面，这样会导致canvas在不断的重新绘制所有的数字，而我的只需要重新绘制需要的部分（局部刷新），这样可以减少计算量。
	2、控制彩球的数量
	   理由：原来的例子，彩色是小球在不断的增加，如果这个页面一直不关闭，后果可想而知。
	3、分层（这个不知道对不对）
	   理由：彩色小球和时钟小球不在同一个canvas中。
*/
define('weather', function(require, exports, module) {
    var global = window,
        $ = jQuery,
        doc = window.document;
    var tool = require('lib:toolClass');
    var global_W = global.innerWidth,
        global_H = global.innerHeight,
        marginLeft = 50,
        marginRight = 50;

    /***定义clock的一些参数***/
    var circle_r = 8; //小圆半径
    var cols = [7, 7, 4, 7, 7, 4, 7, 7]; //列数
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
    var canArr = []; //存放时间对应数字的canvas
    var colors = ["#33B5E5", "#0099CC", "#AA66CC", "#669900", "#FFBB33", "#FF8800", "#FF4444", "CC0000"];
    var baseColor = '#fff';
    var margin = 2; //数字之间的距离margin
    var padding = 5; //canvas的padding
    var rowNum = 10, //数字的行数
        canHeight = rowNum * circle_r * 2 + padding * 2 + (rowNum - 1) * margin; //canvas行高
    //设置clock的位置
    var clockWrap = $('#clock .clock'),
        clockBg = $('#clock');
    var minWidth = 0;

    function initClockCanvas() {
        for (var i = 0; i < cols.length; i++) {
            var canvas = document.createElement('canvas'); // 设置每个数字canvas的高宽
            canvas.width = cols[i] * circle_r * 2 + padding * 2 + (cols[i] - 1) * margin;
            canvas.height = canHeight;
            canvas.className = 'num';
            canArr.push({
                canvas: canvas,
                width: cols[i] * circle_r * 2 + padding * 2 + (cols[i] - 1) * margin,
                height: canHeight
            });
            clockWrap.append(canvas);
            minWidth += canvas.width;
        }
        clockWrap.css({
            left: '200px',
            top: '300px',
            minWidth: minWidth + 'px',
        });
    }
    initClockCanvas();
    var bgcanvas = document.createElement('canvas');
    var bgCtx = bgcanvas.getContext('2d');

    function initColorCanvas() {
        bgcanvas.id = "bgclock";
        bgcanvas.width = global_W;
        bgcanvas.height = global_H;
        $(bgcanvas).css({
            width: global_W,
            height: global_H,
            minWidth: minWidth,
            position: 'absolute'
        });
        clockBg.append(bgcanvas);
        // console.log(canArr);
    }
    initColorCanvas();

    function drawNumber(canvas, num) {
        var ctx = canvas.getContext('2d'),
            arrNum = digit[num];
        var colorBallLeft = $(canvas).offset().left;
        var colorBallTop = $(canvas).offset().top;
        var colorBallArr = [];

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath(); //这里有个问题？案例来说fill之后，会自动closePath；
        // bgCtx.clearRect(0,0,bgcanvas.width,bgcanvas.height);
        bgCtx.beginPath();
        for (var i = 0; i < arrNum.length; i++) {
            for (var j = 0; j < arrNum[i].length; j++) {
                if (arrNum[i][j] == 1) {
                    ctx.fillStyle = colors[j];
                    var r = circle_r;
                    var x = padding + (2 * j + 1) * r + j * margin;
                    var y = padding + (2 * i + 1) * r + i * margin;
                    ctx.moveTo(x + r, y);
                    ctx.arc(x, y, r, 0, 2 * Math.PI);
                    // addColorBall(x + colorBallLeft, y + colorBallTop, r);
                }
            }
        }
        ctx.closePath();
        ctx.fill();
    }
    // 0 1 2 3 4 5 6 7
    // 时时 : 分分 :秒秒
    //setInterval(renderAll, 1000);

    function renderAll() {
        var oD = new Date();
        var hour = oD.getHours();
        var minute = oD.getMinutes();
        var second = oD.getSeconds();
        var str = '' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
        // $('#swd').val(str);
        if (second == 0) { // 判断秒为0 ，重新绘制分钟
            if (str.charAt(3) == '0') {
                drawNumber(canArr[3].canvas, parseInt(str.charAt(3)));
            }
            drawNumber(canArr[4].canvas, parseInt(str.charAt(4)));
        }
        if (minute == 0) { // 判断分钟为0 ，重新绘制小时
            if (str.charAt(1) == '0') {
                drawNumber(canArr[0].canvas, parseInt(str.charAt(0)));
            }
            drawNumber(canArr[1].canvas, parseInt(str.charAt(1)));
        }
        if (str.charAt(7) == '0') {
            drawNumber(canArr[6].canvas, parseInt(str.charAt(6)));
        }
        drawNumber(canArr[7].canvas, parseInt(str.charAt(7)));
    }

    function initClock() {
        var time = timeStr();
        for (var i = 0; i < time.length; i++) {
            drawNumber(canArr[i].canvas, time[i] == ':' ? 10 : parseInt(time[i]));
        }
    }
    //initClock();
    //获取事件字符串 eg："00:00:00"
    function timeStr() {
        var oD = new Date();
        var hour = oD.getHours();
        var minute = oD.getMinutes();
        var second = oD.getSeconds();
        return '' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
    }

    var colorBalls = [];

    function addColorBall(x, y, r, style, cb) {
        // bgCtx.clearRect(0, 0, bgcanvas.width, bgcanvas.height);
        bgCtx.beginPath();
        bgCtx.fillStyle = style || colors[tool.randomInt(0, 7)];
        bgCtx.moveTo(x + r, y);
        bgCtx.arc(x, y, r, 0, 2 * Math.PI);
        bgCtx.fill();
        bgCtx.closePath();
        cb && cb(bgCtx.fillStyle);
    }

    function initColorBalls() {
        for (var i = 0; i < 100; i++) {
            var x = 100 + i * 11 * 2,
                y = 200 + tool.randomInt(10, 40),
                r = 10 + tool.randomInt(0, 5);
            addColorBall(x, y, r, '', function(color) {
                colorBalls.push({
                    x: x,
                    y: y,
                    r: r,
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    color: color,
                    vy: -5
                });
            });
        }

        console.log(colorBalls);
    }
    initColorBalls();
    var offsetX = 0.5,
        offsetY = 0.5,
        vy = 5;

    function updateColorsBalls() {
        bgCtx.clearRect(0, 0, bgcanvas.width, bgcanvas.height);
        for (var i = 0; i < colorBalls.length; i++) {
            colorBalls[i].x += colorBalls[i].vx;
            colorBalls[i].y += colorBalls[i].vy;
            colorBalls[i].vy += colorBalls[i].g;
            if (colorBalls[i].y + colorBalls[i].r >= global_H) {
                colorBalls[i].y = global_H - colorBalls[i].r;
                colorBalls[i].vy = -colorBalls[i].vy * 0.6;
            }
            addColorBall(colorBalls[i].x + offsetX, colorBalls[i].y + offsetY, colorBalls[i].r, colorBalls[i].color);
            if (colorBalls[i].x - colorBalls[i].r <= 50 || colorBalls[i].x + colorBalls[i].r >= global_W - 50) {
                colorBalls.splice(i, 1);
            }
        }
        requestAnimationFrame(updateColorsBalls);
    }
    updateColorsBalls();
    setInterval(initColorBalls, 2000);
});
