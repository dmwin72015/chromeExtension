define('colorClock', function (require, exports, module) {
    var global = window, $ = jQuery;
    /***
     基础参数
     ballRadius  小圆半径
     digit       时钟图形地图数组
     colors      需要的所有颜色  注：第一个为时钟的，其他为随机的彩色小球
     ballMargin  小球之间的距离
     ballPadding 整个数字之间的距离
     rowNum      数字小球的行数
     保存离屏画布保存每一个数字 以及冒号（:）的canvas ，当做缓存，下次使用，直接获取，不需要每次来绘制。
     ************/
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
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0],
            [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
            [1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ] //:
    ];
    //面向对象
    function BallClock(opt) {
        this.map = digit;
        this.offCanvas = {};
        this.colors = ["#FFF", "#33B5E5", "#0099CC", "#AA66CC", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000", '#FF9900', '#FFCC00', '#66CCCC', '#FF6666', '#99CC66'];
        this.ballMargin = 2;
        this.offCanvasPadding = 5;
        this.ballRdius = 8;
        this.defaultColor = this.colors[0];
        this.canvas = $('#clock')[0];
        this.colorBalls = [];
        this.off_left = 0;
        this.off_top = 0;
        this.numPostion = [];
        this.defaultTime = '00:00:00';
        this.hour = '';
        this.minute = '';
        this.second = '';

        return this.init();
    }

    BallClock.prototype = {
        init: function (opt) {
            opt = opt || {};
            var width = opt.width || global.innerWidth,
                height = opt.height || global.innerHeight;
            this.canvas.width = width;
            this.canvas.height = height;
            this.initOffCanvas();
            var dateInfo = this.getTimeString(),
                str = dateInfo.str,
                totalWidth = 0,
                totalHeight = 0;
            this.hour = dateInfo.h;
            this.minute = dateInfo.m;
            this.second = dateInfo.s;
            for (var i = 0; i < str.length; i++) {
                var num = isNaN(str.charAt(i) - 0) ? 10 : str.charAt(i) - 0;
                totalWidth += this.offCanvas[num].w;
            }
            totalHeight = this.offCanvas[0].h;
            this.off_left = Math.round((width - totalWidth) / 2);
            this.off_top = Math.round((height - totalHeight) / 2);
            this.render(str);
            return this;
        },
        getRandomColor: function () {
            return this.colors[randomInt(1, this.colors.length - 1)];
            function randomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        },
        getTimeString: function () {
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
        },
        getBallLoc: function (canvas_wrap, map) {
            var arr = [],
                padding = this.offCanvasPadding,
                margin = this.ballMargin,
                r = this.ballRdius;
            for (var i = 0; i < map.length; i++) {
                for (var j = 0; j < map[i].length; j++) {
                    if (map[i][j] == 1) {
                        arr.push({
                            x: padding + r * (2 * j + 1) + margin * j,
                            y: padding + r * (2 * i + 1) + margin * i,
                            r: r,
                            color: canvas_wrap.style || this.defaultColor
                        });
                    }
                }
            }
            return {
                arr: arr,
                rows: j,
                cols: i,
                w: padding * 2 + (j - 1) * margin + j * r * 2,
                h: padding * 2 + (i - 1) * margin + i * r * 2
            }
        },
        initOffCanvas: function (num) {
            var that = this,
                map = this.map;
            for (var i = 0; i < map.length; i++) {
                var tmp = {};
                tmp.canvas = document.createElement('canvas');
                tmp.numBallMap = calcBallsMap(tmp, digit[i]);
                tmp.canvas.width = tmp.w;
                tmp.canvas.height = tmp.h;
                tmp.style = that.colors[0];
                that.offCanvas[i] = drawNumberOffCanvas(tmp);
            }

            //根据digit数组算出需要绘制小球的位置（相当于计算出小球地图，每个数字对应一个。包括冒号）
            function calcBallsMap(canvas_wrap, map) {
                var mapData = that.getBallLoc(canvas_wrap, map);
                canvas_wrap.rows = mapData.rows;
                canvas_wrap.cols = mapData.cols;
                canvas_wrap.w = mapData.w;
                canvas_wrap.h = mapData.h;
                return mapData.arr.slice();
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
        },
        addColorBall: function (num, pos) {
            var numBallMap = this.offCanvas[num].numBallMap;
            for (var i = 0; i < numBallMap.length; i++) {
                this.colorBalls.push({
                    x: this.numPostion[pos].x + numBallMap[i].x,
                    y: this.numPostion[pos].y + numBallMap[i].y,
                    r: numBallMap[i].r,
                    color: this.getRandomColor(),
                    g: 0.98 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //结果为-4/4
                    vy: -5
                })
            }
        },
        drawColorBall: function (balls) {
            var ctx = this.canvas.getContext('2d'),
                balls = this.colorBalls;
            for (var i = 0, len = balls.length; i < len; i++) {
                ctx.beginPath();
                ctx.fillStyle = balls[i].color;
                ctx.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();
            }
        },
        updateColorBall: function () {
            var colorBalls = this.colorBalls;
            for (var i = 0; i < colorBalls.length; i++) {
                colorBalls[i].x += colorBalls[i].vx;
                colorBalls[i].y += colorBalls[i].vy;
                colorBalls[i].vy += colorBalls[i].g;
                if (colorBalls[i].y + colorBalls[i].r >= this.canvas.height) {
                    colorBalls[i].y = this.canvas.height - colorBalls[i].r;
                    colorBalls[i].vy = -colorBalls[i].vy * 0.68;
                }
                colorBalls[i].x = parseInt(colorBalls[i].x);
                colorBalls[i].y = parseInt(colorBalls[i].y);
                if (colorBalls[i].x - colorBalls[i].r <= 5 || colorBalls[i].x + colorBalls[i].r >= this.canvas.width - 5) {
                    colorBalls.splice(i, 1);
                    i--;
                }
            }
        },
        drawBalls: function (num, pos, isClear) {
            this.canvas.getContext('2d').drawImage(this.offCanvas[num].canvas, this.numPostion[pos].x, this.numPostion[pos].y);
        },
        render: function (dateStr) {
            var that = this;
            for (var i = 0; i < dateStr.length; i++) {
                var num = isNaN(dateStr.charAt(i) - 0) ? 10 : dateStr.charAt(i) - 0;
                that.numPostion.push({
                    x: that.numPostion[i - 1] ? (that.numPostion[i - 1].x + that.numPostion[i - 1].w) : this.off_left,
                    y: this.off_top,
                    w: this.offCanvas[num].w,
                    h: this.offCanvas[num].h
                });
                this.drawBalls(num, i);
                this.addColorBall(num, i);
            }

            function interValDrawing() {
                var currOD = that.getTimeString(),
                    str = currOD.str,
                    second = currOD.s,
                    minute = currOD.m,
                    hour = currOD.h,
                    ctx = that.canvas.getContext('2d');
                ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);
                for (var i = 0; i < str.length; i++) {
                    var num = isNaN(str.charAt(i) - 0) ? 10 : str.charAt(i) - 0;
                    that.drawBalls(num, i, false);
                }
                //'00:00:00'
                // 01234567
                if (second != that.second) {
                    that.addColorBall(parseInt(str.charAt(7)), 7);
                    if (parseInt(hour / 10) != parseInt(that.hour / 10)) { //判断 小时 第一位
                        that.addColorBall(parseInt(hour / 10), 0);
                    }
                    if (parseInt(hour % 10) != parseInt(that.hour % 10)) { //判断 小时 第二位
                        that.addColorBall(parseInt(hour % 10), 1);
                    }
                    if (parseInt(minute / 10) != parseInt(that.minute / 10)) { //判断 分钟 第一位
                        that.addColorBall(parseInt(minute / 10), 3);
                    }
                    if (parseInt(minute % 10) != parseInt(that.minute % 10)) { //判断 分钟 第二位
                        that.addColorBall(parseInt(minute % 10), 4);
                    }
                    if (parseInt(second / 10) != parseInt(that.second / 10)) { //判断 秒钟 第一位
                        that.addColorBall(parseInt(second / 10), 6);
                    }
                }
                that.hour = hour;
                that.minute = minute;
                that.second = second;
                that.drawColorBall();
                that.updateColorBall();
                requestAnimationFrame(interValDrawing);
            }

            interValDrawing();
        }
    };
    var bclock = new BallClock();
    console.log(bclock)
});
