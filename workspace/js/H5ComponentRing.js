/*饼状图*/
var H5ComponentRing = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg)
    
    // 绘制网格线
    var w = cfg.width
    var h = cfg.height
    // 加入一个画布（背景层）
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var r = w/2
    canvas.width = w
    canvas.height = h
    $(canvas).css('z-index', 1)
    component.append(canvas)
    ctx.beginPath()
    ctx.fillStyle = '#eee'
    ctx.lineWidth = 1
    ctx.arc(r,r,r,0,2*Math.PI)
    ctx.fill()

    // 绘制一个数据层
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h
    $(canvas).css('z-index', 2)
    component.append(canvas)
    var colors = ['red', 'green', 'gray', 'orange', 'black']
    var sAngel = 1.5 * Math.PI
    var eAngel= 0
    var aAngel = 2 * Math.PI
    var step = cfg.data.length

    for( var i = 0; i < step; i++){
        ctx.beginPath()
        var item = cfg.data[i] 
        var color = item[2] || colors.pop()  
        eAngel = sAngel + aAngel * item[1]

        ctx.fillStyle = color
        ctx.strokeStyle = color
        ctx.lineWidth = .1
        ctx.moveTo(r, r)
        // console.log(sAngel, eAngel)
        ctx.arc(r, r, r, sAngel, eAngel)
        ctx.fill()
        ctx.stroke()
        sAngel = eAngel
    }
    // 加入一个文字层
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h
    $(canvas).css('z-index', 3)
    component.append(canvas)
    ctx.beginPath()
    ctx.moveTo(r,r)
    ctx.strokeStyle= '#fff'
    ctx.fillStyle= '#fff'
    ctx.lineWidth= 1
    ctx.arc(r,r, 0.7*r, 0, 2 * Math.PI)
    ctx.fill()
    var font = $('<div class="font"></div>')
    font.html(cfg.data[0][0] + '<br />' + ((cfg.data[0][1]*100)>>0)+'%')
    font.css({
        zIndex: 4,
        opacity: 0
    })
    component.append(font)

    // 加入一个蒙版层
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    canvas.width = w
    canvas.height = h
    $(canvas).css('z-index', 3)
    component.append(canvas)
    ctx.beginPath()
    ctx.strokeStyle = '#fff'
    ctx.fillStyle='#fff'
    ctx.lineWidth = 1
    var draw = function (per) {
        if(per >= 1) {
            component.find('.font').css('opacity', 1)
        }
        if (per <= 0) {
            component.find('.font').css('opacity', 0)   
        }
        ctx.clearRect(0,0,w,h)
        ctx.beginPath()
        ctx.moveTo(r, r)
        sAngel = 1.5 * Math.PI
        if( per > 0) {
            ctx.arc(r, r, r, sAngel, sAngel + 2*Math.PI*per, true) 
        } else {
            ctx.arc(r, r, r, 0, 2*Math.PI)
        }
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
    draw(0)
    component.on('onLoad', function() {
        var s = 0;
        for (var i = 0; i < 100; i++){
            // 2s
            setTimeout(function() {
                s = (s * 1000 + 0.01*1000) / 1000
                draw(s)
            }, i*10)
        }
    })
    component.on('onLeave', function() {
        var s = 1;
        for (var i = 0; i < 100; i++){
            // 2s
            setTimeout(function() {
                s = (s * 1000 - 0.01*1000) / 1000
                draw(s)
            }, i*10)
        }
    })
    return component
}