define('clock', function(require, exports, module) {
    //0-9 结构模型 
    var digit = [
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
            [0, 1, 1, 0, 0, 0, 0]
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
    var WINDOW_WIDTH = window.innerWidth - 20;
    var WINDOW_HEIGHT = window.innerHeight - 20;
    var MARGIN_TOP = 500;
    var MARGIN_LEFT = 0;
    //存放彩色小球
    var balls = [];
    const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#669900", "#FFBB33", "#FF8800", "#FF4444", "CC0000"];
    var r = 8; //圆半径
    window.onload = function() {
        var canvas = document.getElementById("src_clock");
        var context = canvas.getContext("2d");
        canvas.width = WINDOW_WIDTH;
        canvas.height = WINDOW_HEIGHT;
        window.setInterval(function() {
            var curr = new Date();
            var curHours = curr.getHours();
            var curMinutes = curr.getMinutes();
            var curSeconds = curr.getSeconds();

            //当时间的秒数改变时添加彩色小球
            if (preSeconds != curSeconds) {
                if (parseInt(curHours / 10) != parseInt(preHours / 10)) {
                    addBall(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
                }
                if (parseInt(curHours % 10) != parseInt(preHours % 10)) {
                    addBall(MARGIN_LEFT + 15 * (r + 1), MARGIN_TOP, parseInt(curHours % 10));
                }
                if (parseInt(curMinutes / 10) != parseInt(preMinutes / 10)) {
                    addBall(MARGIN_LEFT + 39 * (r + 1), MARGIN_TOP, parseInt(curMinutes / 10));
                }
                if (parseInt(curMinutes % 10) != parseInt(preMinutes % 10)) {
                    addBall(MARGIN_LEFT + 54 * (r + 1), MARGIN_TOP, parseInt(curMinutes % 10));
                }
                if (parseInt(curSeconds / 10) != parseInt(preSeconds / 10)) {
                    addBall(MARGIN_LEFT + 78 * (r + 1), MARGIN_TOP, parseInt(curSeconds / 10));
                }
                if (parseInt(curSeconds % 10) != parseInt(preSeconds % 10)) {
                    addBall(MARGIN_LEFT + 93 * (r + 1), MARGIN_TOP, parseInt(curSeconds % 10));
                }
            }
            render(context);
            console.log(balls.length);
        }, 50);
    }

    //添加小球(数字num上的彩色小球，x，y:数字方块容器的左上角顶点坐标)
    function addBall(x, y, num) {
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] == 1) {
                    var ball = {
                        x: x + j * 2 * (r + 1) + r + 1,
                        y: y + i * 2 * (r + 1) + r + 1,
                        g: 1.5 + Math.random(),
                        vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, //结果为-4/4
                        vy: -5,
                        color: colors[Math.floor(Math.random() * colors.length)]
                    };
                    balls.push(ball);
                }
            }
        }
    }

    //----画彩色小球

    function renderBalls(context) {
        //context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)
        for (var i = 0; i < balls.length; i++) {
            context.beginPath();
            context.arc(balls[i].x, balls[i].y, r, 0, 2 * Math.PI, false);
            context.fillStyle = balls[i].color;
            context.fill();
            context.closePath();
        }
    }
    //----更新彩色小球位置
    function UpdateBalls() {
        for (var i = 0; i < balls.length; i++) {
            balls[i].x += balls[i].vx;
            balls[i].y += balls[i].vy;
            balls[i].vy += balls[i].g;
            if (balls[i].y + r >= WINDOW_HEIGHT) {
                balls[i].y = WINDOW_HEIGHT - r;
                balls[i].vy = -balls[i].vy * 0.6;
            }
        }
    }

    var preHours;
    var preMinutes;
    var preSeconds;
    //渲染整个画布
    function render(context) {
        context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT)
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        preHours = hours;
        preMinutes = minutes;
        preSeconds = seconds;
        //---时
        renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
        renderDigit(MARGIN_LEFT + 15 * (r + 1), MARGIN_TOP, hours % 10, context);
        renderDigit(MARGIN_LEFT + 30 * (r + 1), MARGIN_TOP, 10, context);
        //---分
        renderDigit(MARGIN_LEFT + 39 * (r + 1), MARGIN_TOP, parseInt(minutes / 10), context);
        renderDigit(MARGIN_LEFT + 54 * (r + 1), MARGIN_TOP, minutes % 10, context);
        renderDigit(MARGIN_LEFT + 69 * (r + 1), MARGIN_TOP, 10, context);
        //---秒
        renderDigit(MARGIN_LEFT + 78 * (r + 1), MARGIN_TOP, parseInt(seconds / 10), context);
        renderDigit(MARGIN_LEFT + 93 * (r + 1), MARGIN_TOP, seconds % 10, context);
        //---画小球
        renderBalls(context);
        //---改变小球路径
        UpdateBalls();
    }

    //渲染每个数字
    function renderDigit(x, y, num, context) {
        context.fillStyle = "green";
        for (var i = 0; i < digit[num].length; i++) {
            for (var j = 0; j < digit[num][i].length; j++) {
                if (digit[num][i][j] == 1) {
                    context.beginPath();
                    context.arc(x + j * 2 * (r + 1) + r + 1, y + i * 2 * (r + 1) + r + 1, r, 0, 2 * Math.PI, false);
                    context.closePath();
                    context.fill();
                }
            }
        }
    }
});