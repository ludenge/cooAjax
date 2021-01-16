# cooAjax
cooAjax 用于拦截ajax。 它细化原生ajax请求过程，包括beforeOpen, afterOpen, beforeSend, afterSend, loadend, onreadystatechange六个生命周期钩子

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
      # cooAjax.set方法 用于设置对象的属性值（解决只读属性不能赋值的问题）
      cooAjax.set(xhr, 'response', JSON.stringify({ name: '自定义响应数据'}))
      cooAjax.set(xhr, 'responseText', JSON.stringify({ name: '自定义响应数据'}))
    },
    # beforeSend 可以修改请求体
     -- 返回结果为真时，不会调用原生send方法，一般不用设置返回值
    beforeSend(args) {
      console.log('before send', args)
      args[0] = JSON.stringify({name: '这里修改请求体的值'})
      return true
    },
    afterSend(args, xhr) {
      console.log('after send', args, xhr)
    },
    # onreadystatechange 是原生 onreadystatechange 事件，readystate改变时触发
    onreadystatechange(e) {
      console.log(e.target)
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
      if (args[1].includes('/list.json')) {
        args[1] = './xxx/list.json'
      }
    },
    afterOpen(args, xhr) {
      cooAjax.set(xhr, 'response', JSON.stringify({ value: '我可能是来自loacalstorage的数据'}))
    }
  })
  
  var xhr = new XMLHttpRequest()
  xhr.open('get', './list.json');
  xhr.send()
  xhr.onreadystatechange = function(e) {
    if (xhr.readyState === 4) {
      console.log('response:', xhr.response);
    }
  }
```

我们用原生方式，请求*./list.json*，经过 cooAjax 的处理，实际网络请求url是 *./xxx/list.json*。并且，打印 response 的时候，得到的值为 *{"value":"我可能是来自loacalstorage的数据"}*

通过一个简单的例子，我们实现 对 ajax 的拦截，修改了请求url和响应数据，虽然 cooAjax 代码简单，但功能强大，欢迎一起发掘它更多好玩的用法。
