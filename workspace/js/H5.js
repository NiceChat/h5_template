/**
 * H5 页面组织文件
 */
var H5 = function () {
  this.id = ('h5_' + Math.random()).replace('.', '_')
  this.el = $('<div class="'+this.id+'"></div>').hide()
  this.page = []
  $('body').append( this.el )

  /**
   * [addPage description]
   * @param {name} name 页面名称
   * @param {text} text 页面描述
   * @return {this} 当前页面对象
   */
  this.addPage = function (name, text) {
    var page = $('<div class="h5_page section"></div>')
    if (name !== undefined) {
      page.addClass('h5_page_' + name)
    }
    if (text !== undefined) {
      page.text(text)
    }
    this.el.append(page)
    this.page.push(page)
    return this
  }

  
  this.addComponent = function (name, cfg) {
    var cfg = cfg || {}
    cfg = $.extend({
      type: 'base'
    }, cfg)
    var component
    var page = this.page.slice(-1)[0]
    switch (cfg.type) {
      case 'base':
        component = new H5ComponentBase(name, cfg)
        break;
      default:
    }
    page.append(component)
    return this
  }

  this.loader = function (page) {
    this.el.fullpage({
      onLeave: function (index, nextIndex, direction) {
          $(this).find('.h5_component').trigger('onLeave')
      },
      afterLoad: function (anchorLink, index) {
          $(this).find('.h5_component').trigger('onLoad')
      }
    })
    
    this.page[0].find('.h5_component').trigger('onLoad')
    this.el.show()
    page && $.fn.fullpage.moveTo(page)
  }
  return this
}