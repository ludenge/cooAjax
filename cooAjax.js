window.cooAjax = {
  XHR: window.XMLHttpRequest,
  start(opts) {
    return window.XMLHttpRequest = class extends cooAjax.XHR {
      constructor() {
        super()
        opts['loadend'] && this.addEventListener('loadend', opts['loadend'])
        opts['onreadystatechange'] && this.addEventListener('readystatechange', opts['onreadystatechange'])
      }
      open() {
        opts['beforeOpen'] && opts['beforeOpen'](arguments)
        cooAjax.XHR.prototype['open'].apply(this, arguments)
        opts['afterOpen'] && opts['afterOpen'](arguments, this)
      }
      send() {
        opts['beforeSend'] && opts['beforeSend'](arguments) || cooAjax.XHR.prototype['send'].apply(this,
          arguments)
        opts['afterSend'] && opts['afterSend'](arguments, this)
      }
    }
  },
  stop() {
    window.XMLHttpRequest = cooAjax.XHR;
  },
  set(obj, prop, value) {
    Object.defineProperty(obj, prop, {
      get: () => value
    })
  }
}