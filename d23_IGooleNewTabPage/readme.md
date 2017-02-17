###README创建
***
这个demo是从网上的一个电子时钟，改变借鉴（其实就是抄）过来的，但是并不是照搬过来的，
我个人改进的地方：（不一定对）

1、将时、分、秒、冒号分为不同的canvas
   原来的例子，是放在了同一个canvas上面，这样会导致canvas在不断的重新绘制所有的数字，而我的只需要重新绘制需要的部分（局部刷新），这样可以减少计算量。目前使用的是多个canvas，后续改进。

2、控制彩球的数量
   原来的例子，彩色是小球在不断的增加，如果这个页面一直不关闭，后果可想而知。

3、分层（这个不知道对不对）
   彩色小球和时钟小球不在同一个canvas中。

4、集中批量调用画布
   在绘制数字的时候，把所有的小球绘制好在填充，避免频繁调用beginPath 、closePath。

### 变更 计划
***
1、根据有网上建议，使用离屏画布，预先将内容变化平率不高的部分绘制在离屏的canvas，然后在使用drawImage 添加到现在的canvas中。
	这个方法在数据量较小的情况下，心性能不会有太大影响。
	但是经过我自己测试，循环10000+次的时候，就会有明显的卡顿行为。

2、放弃使用多个canvas，改为一个canvas，然后刷新局部。局部代码如下 

``` javascript
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
    $('#bg').append(canvas);
    return canvas_wrap;
}
```
  这个方法的功能是绘制每一个离线的canvas，而且是把所有的小球都绘制玩之后，才去fill。

  但是这种情况下，在循环中，应该每次都beginPath().防止fill的时候，应为上次的路径没有闭合，导致下次绘制在以前的路径中，然后最后fill的时候，就会出现和预期结果不一致，尤其在路径复杂的时候，填充路径比较那一预料。
 
  可是！可是！可是！这个本应该出现的`填充混乱的正确结果`没有出现，却出现了`错误的想要的结果`。
  
  我在其他地方测试的时候却无法重现！！！很纠结。