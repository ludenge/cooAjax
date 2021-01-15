# cooAjax
cooAjax 用于拦截ajax。 它细化原生ajax请求过程，包括beforeOpen, afterOpen, beforeSend, afterSend, loadend五个生命周期钩子

## 使用

```js
  # start方法，开始拦截
  cooAjax.start({
    # beforeOpen 可以修改open方法的 methods,url等参数
    beforeOpen(args) {
      console.log('before open', args)
      // args[0] = 'get'
      args[1] = './xxx/list.json'
    },
    # afterOpen 可以根据 请求url，利用属性描述符实现修改响应数据
    afterOpen(args, xhr) {
      console.log('after open', args, xhr)
      Object.defineProperty(xhr, 'response', {
        get() {
          return '自定义拦截数据'
        }
      })
    },
    # beforeSend 可以修改请求体
     -- 返回结果为真时，不会调用原生send方法，一般不用设置返回值
    beforeSend(args) {
      console.log('before send', args)
      args[0] = JSON.stringify({name: 'ludeng', age: 18})
      return true
    },
    afterSend(args, xhr) {
      console.log('after send', args, xhr)
    },
    # loadend 是原生 loadend 事件，资源加载结束后触发
    loadend(e) {
      console.log(e.target)
    }
  })
  # 停止拦截
  cooAjax.stop()
```

## 示例
```js
  cooAjax.start({
    beforeOpen(args) {
      args[1] = './xxx/list.json'
    },
    afterOpen(args, xhr) {
      Object.defineProperty(xhr, 'response', {
        get() {
          return JSON.stringify({ value: '我是来自storage的数据'})
        }
      })
    }
  })
  
  var xhr = new XMLHttpRequest()
  xhr.open('get', './news.json');
  xhr.send('{name: "ludeng"}')
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      console.log('response:', xhr.response);
    }
  }
```

我们用原生方式，请求'./news.json'，经过cooAjax的处理，实际网络请求是'./xxx/list.json'，并且打印response的时候，得到的值为'{"value":"我是来自storage的数据"}'

通过一个简单的例子，我们实现ajax拦截，虽然cooAjax代码简单，但是极具潜力，欢迎一起发掘它更多好玩的用法。
