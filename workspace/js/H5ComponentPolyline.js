/*折线图*/
var H5ComponentPolyline = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg)
    
    // 绘制网格线
    var w = cfg.width
    var h = cfg.height
    // 加入一个画布（背景层）
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h
    component.append(canvas)
    //  水平网格线 10份
    var step = 10
    ctx.beginPath()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#ccc'
    var row_w = (w / (cfg.data.length+1))
    for ( var i = 0; i < step+1; i++) {
        var y = (h/step) * i  
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
    }

    // 垂直网格线
    step = cfg.data.length + 1
    for ( var i = 0; i < step+1; i++) {
        var x = (w/step) * i  
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        if (cfg.data[i]) {
            var sec = 1.5 + i*0.2
            var text = $('<div class="text" style="-webkit-transition: all 1s '+sec+'s"></div>')
            text.text(cfg.data[i][0])
            text.css({
                width: row_w/2,
                left: 0.5*row_w*(i + 0.5),
                bottom: -20
            })
            component.append(text)
        }
    }
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
        ctx.clearRect(0,0,w,h)
        // 绘制折线数据
        ctx.beginPath()
        ctx.lineWidth = 3
        ctx.strokeStyle = '#ff8878'
        // 画点
        var piontArr = []
        $.each(cfg.data, function (index, item) {
            var x = row_w * (index + 1)
            var y = h-h*item[1]*per
            ctx.moveTo(x, y)
            piontArr.push({x: x, y: y})
            ctx.arc(x,y,5,0,2*Math.PI)
            ctx.fillStyle = '#ff8878'
            ctx.fill()
        })
        // 连线并写数据
        ctx.moveTo(piontArr[0]['x'], piontArr[0]['y'])
        $.each(piontArr, function (index, item) {
            x = item['x']
            y = item['y']
            var data = cfg.data[index]
            var text = ((data[1] * 100)>>0) + '%'
            ctx.fillStyle = data[2] ? data[2] : '#595959'
            ctx.fillText(text, x-10, y-10)
            ctx.lineTo(x, y)
        })
        ctx.stroke()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255,255,255, .2)'
        ctx.fillStyle = 'rgba(255, 136, 120, 0.1)'
        // 绘制阴影
        ctx.lineTo(piontArr[piontArr.length-1]['x'], h)
        ctx.lineTo(row_w, h)
        ctx.fill()
    }
    // draw(1)
    component.on('onLoad', function() {
        var s = 0;
        for (var i = 0; i < 100; i++){
            // 2s
            setTimeout(function() {
                s+=0.01
                draw(s)
            }, i*10+500)
        }
    })
    component.on('onLeave', function() {
        var s = 1;
        for (var i = 0; i < 100; i++){
            // 2s
            setTimeout(function() {
                s-=0.01
                draw(s)
            }, i*10)
        }
    })
    return component
}