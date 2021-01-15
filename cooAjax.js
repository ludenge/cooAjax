window.cooAjax = {
  XHR: window.XMLHttpRequest,
  start(opts) {
    class CooXHR extends cooAjax.XHR {
      constructor() {
        super()
        opts['loadend'] && this.addEventListener('loadend', opts['loadend'])
      }
      open() {
        opts['beforeOpen'] && opts['beforeOpen'](arguments)
        cooAjax.XHR.prototype['open'].apply(this, arguments)
        opts['afterOpen'] && opts['afterOpen'](arguments, this)
      }
      send() {
        opts['beforeSend'] && opts['beforeSend'](arguments) && cooAjax.XHR.prototype['send'].apply(this,
          arguments)
        opts['afterSend'] && opts['afterSend'](arguments, this)
      }
    }
    window.XMLHttpRequest = CooXHR;
  },
  stop() {
    window.XMLHttpRequest = cooAjax.XHR;
  }
}
