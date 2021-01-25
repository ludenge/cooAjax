window.cooAjax = {
  XHR: window.XMLHttpRequest,
  fetch: window.fetch.bind(window),
  opts: {},
  start(opts) {
    Object.assign(this.opts, opts)
    window.XMLHttpRequest = cooenXHR
    if (opts['beforeRequest'] || opts['beforeResponse']) {
      window.fetch = cooenFetch
    }
  },
  stop() {
    this.opts = {}
    window.XMLHttpRequest = cooAjax.XHR
    if (window.fetch === cooenFetch) {
      window.fetch = cooAjax.fetch
    }
  },
  set(obj, prop, value) {
    Object.defineProperty(obj, prop, {
      get: () => value
    })
  }
}

class cooenXHR extends cooAjax.XHR {
  constructor() {
    super()
    cooAjax.opts['loadend'] && this.addEventListener('loadend', cooAjax.opts['loadend'])
    cooAjax.opts['onreadystatechange'] && this.addEventListener('readystatechange', cooAjax.opts['onreadystatechange'])
  }
  open() {
    cooAjax.opts['beforeOpen'] && cooAjax.opts['beforeOpen'](arguments)
    cooAjax.XHR.prototype['open'].apply(this, arguments)
    cooAjax.opts['afterOpen'] && cooAjax.opts['afterOpen'](arguments, this)
  }
  send() {
    cooAjax.opts['beforeSend'] && cooAjax.opts['beforeSend'](arguments) || cooAjax.XHR.prototype['send'].apply(this,
      arguments)
    cooAjax.opts['afterSend'] && cooAjax.opts['afterSend'](arguments, this)
  }
}

const cooenFetch = function() {
  // fetch(url, init)形式可以拦截， fetch(new Request)不拦截
  typeof arguments[0] === 'string' && cooAjax.opts['beforeRequest'] && cooAjax.opts['beforeRequest'](arguments)
  return cooAjax.fetch(...arguments).then((response) => {
    let txt = cooAjax.opts['beforeResponse'] && cooAjax.opts['beforeResponse'](response)
    if (!txt) return response
    
    if (typeof txt !== 'string') {
      try{
        txt = JSON.stringify(txt)
      }catch(e){
        console.log(e)
        return response
      }
    }
    const proxy = new Proxy(new Response(txt), {
      get: function (target, name) {
        if(typeof target[name] === 'function') {
          if (name === 'clone') return response[name].bind(response)
          // arrayBuffer blob json text formData
          return target[name].bind(target)
        }
        return response[name]
      }
    })
    return proxy
  })
}
