/*基本图文组件*/
var H5ComponentBase = function (name, cfg) {
    var cfg = cfg
    var id = ('h5_c_'+ Math.random()).replace('.','_')

    var cls = ' h5_component_'+ cfg.type;
    var component = $('<div class="h5_component '+cls+' h5_component_name_'+ name +'" id="'+id+'"></div>')

    if(typeof cfg.onClick == 'function') {        
        component.on('click', cfg.onClick)
    }
    cfg.text && component.text(cfg.text)
    cfg.width && component.width(cfg.width / 2)
    cfg.height && component.height(cfg.height / 2)

    cfg.css && component.css(cfg.css)
    cfg.bg && component.css('backgroundImage','url('+cfg.bg+')')
    if( cfg.center === true ) {
        component.css({
            marginLeft  : (cfg.width / 4 *  -1) + 'px',
            left: "50%"
        })
    }

    // 组件的onLoad
    component.on('onLoad', function () {
        setTimeout(function () {
            component.removeClass(cls+'_leave')
            component.addClass(cls+'_load')
            cfg.animateIn && component.animate( cfg.animateIn )
        }, cfg.delay || 0)
        return false
    })

    // 组件的onLeave
    component.on('onLeave', function () {
        setTimeout(function () {
            component.removeClass(cls+'_load')
            component.addClass(cls+'_leave')
            cfg.animateOut && component.animate( cfg.animateOut )
        }, cfg.delay || 0)
        return false
    })

    return component
}