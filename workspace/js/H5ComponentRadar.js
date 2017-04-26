/*折线图*/
var H5ComponentRadar = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg)
    
    // 绘制网格线
    var w = cfg.width
    var h = cfg.height
    // 加入一个画布（背景层）
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h
    var step = cfg.data.length
    var r = w/2
    component.append(canvas)

    // 计算一个圆周上的坐标
    // 已知圆心坐标（a，b）半径r 角度deg
    // x = a + Math.sin(rad) * r
    // y = b + Match.cos(rad) * r
    // rad = (2*Math.PI / 360) * (360 / step) * i
    var isBlue = false
    for ( var s = 10; s > 0; s--) {     
        ctx.beginPath()
        for (var i = 0; i <= step; i++) {
            var rad = (2*Math.PI / 360) * (360 / step) * i
            var x = r + Math.sin(rad) * r * (s/10)
            var y = r + Math.cos(rad) * r * (s/10)
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = (isBlue = !isBlue) ? '#99c0ff' : '#f1f9ff'  
        ctx.fill()
    }

    // 绘制伞骨图
    for (var i = 0; i < step; i++) {
        var rad = (2*Math.PI / 360) * (360 / step) * i
        var x = r + Math.sin(rad) * r
        var y = r + Math.cos(rad) * r
        ctx.moveTo(r, r)
        ctx.lineTo(x, y) 
        var text = $('<div class="text"></div>')
        text.text(cfg.data[i][0])
        var sec = (0.5+i*0.2) + 's'
        text.css('transition', 'all .5s '+ sec)
        if (x > w/2) {
            text.css('left', x / 2)
        } else {
            text.css('right', (w-x) / 2)
        }
        if ( y > h / 2){
            text.css('top', y / 2)   
        } else {
            text.css('bottom', (h-y) / 2)   
        }
        if (cfg.data[i][2]) {
            text.css('color', cfg.data[i][2])
        }
        text.css('opacity', 0)
        component.append(text)
    }
    ctx.strokeStyle = '#e0e0e0'
    ctx.stroke()

    // 绘制折线数据(数据层)
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h
    component.append(canvas)
    /**
     * 绘图
     * @param  {[type]} per 所占比分
     * @return {[component]}     组件本身
     */
    var draw  = function (per) {
        if ( per < 1) {
            component.find('.text').css('opacity', '0')
        }
        if ( per >= 1) {
            component.find('.text').css('opacity', '1')
        }
        ctx.clearRect(0,0,w,h)
        // 画线
        ctx.beginPath()
        ctx.strokeStyle = '#666'
        for (var i = 0; i < step; i++) {
            var rate = cfg.data[i][1] * per
            // return
            var rad = (2*Math.PI / 360) * (360 / step) * i
            var x = r + Math.sin(rad) * r * rate
            var y = r + Math.cos(rad) * r * rate
            ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fillStyle = 'rgba(255, 103, 103, 0.41)'
        ctx.fill()
        ctx.stroke()
        // 画点
        for (var i = 0; i < step; i++) {
            ctx.beginPath()
            var rate = cfg.data[i][1] * per
            // return
            var rad = (2*Math.PI / 360) * (360 / step) * i
            var x = r + Math.sin(rad) * r * rate
            var y = r + Math.cos(rad) * r * rate
            // var text = cfg.data[i][0] +':'+((rate * 100) >> 0) + '%'
            ctx.moveTo(x,y)
            var color = cfg.data[i][2] ? cfg.data[i][2] : '#333' 
            ctx.fillStyle = color
            // ctx.fillText(text, x-10, y-10)
            // console.log(cfg.data[i][2])
            // ctx.fillStyle = cfg.data[i][2] ? '#0b48e3' : '#ccc'
            ctx.arc(x, y, 5, 0, 2*Math.PI)
            ctx.fill()
        }
    }
    // draw(1)
    component.on('onLoad', function() {
        var s = 0;
        for (var i = 0; i < 100; i++){
            // 1s
            setTimeout(function() {
                s+=0.01
                draw(s)
            }, i*10+500)
        }
    })
    component.on('onLeave', function() {
        var s = 1;
        for (var i = 0; i < 100; i++){
            // 1s
            setTimeout(function() {
                s-=0.01
                draw(s)
            }, i*10)
        }
    })
    return component
}