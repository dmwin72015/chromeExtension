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
    var wraper = $('#bg');
    canvas.width = GLOBAL_W;
    canvas.height = GLOBAL_H;

    //保存离屏画布 
    // 思路一：保存时分秒的canvas
    var offCanvas = [];

    function initOffCanvasPosition() {
        for (var i = 0; i < numCols.length; i++) {
            var canvas = document.createElement('canvas');
            var w = calcWidth(numCols[i]);
            var h = calcHeight(rowNum);
            offCanvas[i] = {
                canvas: canvas,
                w: w,
                h: h,
                x: offCanvas[i - 1] ? (offCanvas[i - 1].x + offCanvas[i - 1].w) : MAR_L,
                y: MAR_T
            }
        }

        function calcWidth(ballnum) {
            return ballPadding * 2 + (ballnum - 1) * ballMargin + ballnum * ballRadius * 2;
        }

        function calcHeight(rows) {
            return ballPadding * 2 + (rows - 1) * ballMargin + rows * ballRadius * 2;
        }
    }
    initOffCanvasPosition();

    var ballPosition = {}; //存放每个数字对应的位置
    function initBallPosition(color) {
        var offX = offX || 0,
            offY = offY || 0;
        for (var i = 0; i < digit.length; i++) {
            ballPosition[i] = calcBallPostion(digit[i]);
        }

        function calcBallPostion(map) {
            var arr = [];
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    if (map[i][j] == 1) {
                        arr.push({
                            x: ballPadding + ballRadius * (2 * j + 1) + ballMargin * j,
                            y: ballPadding + ballRadius * (2 * i + 1) + ballMargin * i,
                            color: color ? COLORS[tool.randomInt(1, COLORS.length - 1)] : COLORS[0],
                        });
                    }
                }
            }
            return arr.slice();
        }
    }
    initBallPosition();


    var dateStr = '12:34:56'.split('');
    var dateMap = {
        h1: 0,
        h2: 1,
        p1: 2,
        m1: 3,
        m2: 4,
        p2: 5,
        s1: 6,
        s2: 7
    }

    function drawNumber(type, num) {
        var ballMap = ballPosition[dateMap[type]];
        var offCanvasObj = offCanvas[dateMap[type]];

        var off_can = offCanvasObj.canvas,
            off_ctx = off_can.getContext('2d'),
            off_x = offCanvasObj.x,
            off_y = offCanvasObj.y,
            r = ballRadius;

        off_can.id = 'test1';
        off_can.width = offCanvasObj.w;
        off_can.height = offCanvasObj.h;

        off_ctx.beginPath();
        off_ctx.fillStyle = COLORS[0];

        for (var i = 0; i < ballMap.length; i++) {
            off_ctx.moveTo(ballMap[i].x + r, ballMap[i].y);
            off_ctx.arc(ballMap[i].x, ballMap[i].y, r, 0, 2 * Math.PI);
        }

        off_ctx.closePath();
        off_ctx.fill();

        $('#bg').append(off_can);

        console.log(offCanvas);
        // canvas.getContext('2d').drawImage(off_can, off_x, off_y);
    }
    // drawNumber('h1', 2);

    //保存离屏画布 
    // 思路二：保存每一个数字 以及冒号（:）的canvas
    var offCanvasNew = {};
    var numColsNew = [7, 4]; //两种，一个数字宽度为7 ，一个是冒号，宽度为4
    var numRowsNew = 10;
    var numColsNew = [7, 7, 4, 7, 7, 4, 7, 7]; //时 ：分 ：秒的列数,
    var numberPosition = []; // 时 ：分 ：秒 的位置

    for (var i = 0; i < numColsNew.length; i++) {
        numberPosition[i] = {
            w: calcWidth(numColsNew[i]),
            h: calcHeight(numRowsNew),
            x: numberPosition[i - 1] ? (numberPosition[i - 1].x + numberPosition[i - 1].w) : MAR_L,
            y: MAR_T
        }
    }

    function initNumber

    function initNumberNew(num) {
        for (var i = 0; i < digit.length; i++) {
            offCanvasNew[i] = {};
            offCanvasNew[i].canvas = document.createElement('canvas')
            offCanvasNew[i].ballmap = createOffCanvas(digit[i]);
            offCanvasNew[i].w = calcWidth(i < 10 ? numColsNew[0] : numColsNew[1]);
            offCanvasNew[i].h = calcHeight(numRowsNew);
            drawBall(offCanvasNew[i].canvas, offCanvasNew[i].ballmap);
        }

        function createOffCanvas(map) {
            var arr = [];
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    if (map[i][j] == 1) {
                        arr.push({
                            x: ballPadding + ballRadius * (2 * j + 1) + ballMargin * j,
                            y: ballPadding + ballRadius * (2 * i + 1) + ballMargin * i,
                            r: ballRadius
                                // color: color ? COLORS[tool.randomInt(1, COLORS.length - 1)] : COLORS[0],
                        });
                    }
                }
            }
            return arr.slice();
        }

        function drawBall(canvas, ballMap) {
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.fillStyle = '#fff';
            for (var i = 0; i < ballMap.length; i++) {
                ctx.moveTo(ballMap[i].x + ballMap[i].r, ballMap[i].y);
                ctx.arc(ballMap[i].x, ballMap[i].y, ballMap[i].r, 0, 2 * Math.PI);
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    function calcWidth(ballnum) {
        return ballPadding * 2 + (ballnum - 1) * ballMargin + ballnum * ballRadius * 2;
    }

    function calcHeight(rows) {
        return ballPadding * 2 + (rows - 1) * ballMargin + rows * ballRadius * 2;
    }
    initNumberNew();
    console.log(offCanvasNew);

    // 时时 : 分分 :秒秒
    //setInterval(renderAll, 1000);

    function renderAll() {
        var oD = new Date();
        var hour = oD.getHours();
        var minute = oD.getMinutes();
        var second = oD.getSeconds();
        var str = '' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':' + (second > 9 ? second : '0' + second);
    }
});
