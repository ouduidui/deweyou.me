---
lang: zh-CN
title: 手把手教你实现axios
description: 手把手教你实现axios
date: 2022-01-19T08:00:00.000+00:00
author: Dewey Ou
---

# 手把手教你实现 axios

> github: https://github.com/ouduidui/mini-axios

## 初始化项目

该项目使用`webpack`打包，先来初始化一下项目：

```shell
# 初始化
pnpm init -y

# 安装webpack
pnpm i webpack-cli webpack -D
```

然后新建一下`webpack.config.js`：

```js
module.exports = {
  entry: './index.js',
  output: {
    path: `${__dirname}/dist/`,
    filename: 'axios.min.js',
    library: 'axios',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
}
```

然后新建一个`index.js`文件，输入点测试代码，在命令行输入`webpack`进行打包。

## 入口文件

首先在目录下新建`lib`文件夹，作为我们的源文件路径，然后再新建一个`axios.js`，作为入口文件。

而刚刚我们在根路径新建了`index.js`，实际上就是导出`axios.js`：

```javascript
// index.js
module.exports = require('./lib/axios')
```

而在`axios.js`中，会实现`axios`函数。

实现`axios`函数，会使用一个`createInstance`方法去创建，这里会涉及两个点，一个是`defaultConfig`，即默认配置，一个
是`Axios`类，它用于实现`axios`主要功能。

```javascript
// lib/axios
const Axios = require('./core/Axios')
const defaults = require('./defaults')

function createInstance(defaultConfig) {
  // 新建实例
  const context = new Axios(defaultConfig)
  return context
}

// 创建axios
const axios = createInstance(defaults)

module.exports = axios
```

## 默认配置

在创建`axios`方法时，我们会传入一个`defaults`对象作为默认配置，现在我们就来实现它。

在`lib`路径下新建`defaults.js`。

```javascript
// lib/defaults.js
const defaults = {}
module.exports = defaults
```

接下来我们先来实现适配器，而其他配置在后面需要用到的时候再回来实现。

什么是适配器？如果用过`axios`的话，会知道它可以用于网页请求，同时也可以用于`node`环境请求。而众所周知，在网页端我们想要
实现请求接口，实际上使用的是`XMLHttpRequest`，而在`node`环境，我们会使用`http` 或`https`模块。

而这里的适配器，就会根据你使用的环境，帮你提前选好应当使用的模块。

```javascript
// lib/defaults.js

/**
 * 获取适配器
 */
function getDefaultAdapter() {
  let adapter
  if (typeof XMLHttpRequest !== 'undefined') {
    // 浏览器端使用XMLHttpRequest
    adapter = require('./adapters/xhr')
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // node端使用http
    adapter = require('./adapters/http')
  }

  return adapter
}

const defaults = {
  // 适配器
  adapter: getDefaultAdapter(),
}
```

同时，我们不会直接把`XMLHttpRequest`或者`http`模块直接复制给适配器`adapter`，而是会将它们封装起来，形成一个工厂模式。

这时我们需要在`lib`文件夹下新建`adapters`文件夹，然后新建`xhr.js`和`http.js`：

```javascript
// xhr.js
module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    // TODO
  })
}

// http.js
module.exports = function httpAdapter(config) {
  return new Promise((resolve, reject) => {
    // TODO
  })
}
```

我们后面再来实现它们，现在先回头去看看`Axios`。

## Axios 类

`Axios`类中会实现`axios`的核心方法。

首先我们在`lib`路径下新建`core`文件夹，里面会存放我们核心代码。然后在里面新建`Axios`文件。

```javascript
// lib/core/Axios.js

function Axios(instanceConfig) {
  // 保存默认配置
  this.defaults = instanceConfig
}

module.exports = Axios
```

> 有人可能会问为什么不直接使用 ES6 的 Class 去实现。其实也不是不可以，但是我会偏向于模仿源码的实现，这样子找问题也会方便
> 点，顺便可以学习一下。看个人喜好叭。

而`Axios`有一个核心的实例方法——`request`。它就是用于发送请求。

我们用过`axios`都知道，它接收两种传参方法，分别为`axios(url, options)`和`axios(options)`，因此`request`会接收两个参数。
然后再最开始将参数进行合并。

```javascript
// lib/core/Axios.js
Axios.prototype.request = function (configOrUrl, config) {
  // 支持 request(url, options) 和 request(options) 两种写法
  if (typeof configOrUrl === 'string') {
    config = config || {}
    config.url = configOrUrl
  } else {
    config = configOrUrl || {}
  }

  // TODO
}
```

### 重构`createInstance`

现在如果细心的朋友，就会发现一个问题了，我们创建`axios`的时候，是`new Axios`，而这样实现的话我们需要`axios.request()`去
实现请求，但是我们之前使用是直接`axios()`就可以了。

因此我们得来完善一下`createInstance`方法。

首先我们可以明确一点，`axios`方法实质上就是`Axios.prototype.request`方法，因此我们可以以`new Axios`创建的实例，然后使
用`bind`绑定实例返回一个新方法赋值给`axios`。

同时，实质上`Axios`还有其它实例方法，也就是各种请求方式的实例方法，比如我们常用的`axios.get()`、`axios.post()`，而它们的
核心还是调用`request`方法。因此我们还需要将`Axios` 的实例方法以及实例属性，一一赋值给`axios`上。

看一下具体实现：

```javascript
// lib/axios.js
function createInstance(defaultConfig) {
  // 新建实例
  const context = new Axios(defaultConfig)
  // 实现axios方法
  const instance = Axios.prototype.request.bind(context)

  // 绑定Axios的实例属性和实例方法
  Object.keys(context).forEach((key) => {
    if (typeof context[key] === 'function') {
      instance[key] = context[key].bind(context)
    } else {
      instance[key] = context[key]
    }
  })

  return instance
}
```

> 刚刚提到的`axios.get()`等实例方法，这里就不一一实现，实质上就是调用`request`方法，感兴趣的朋友自己去看一
> 下[源码](https://github.com/OUDUIDUI/source-study/blob/master/packages/axios/lib/core/Axios.js#L151)

接下来我们继续完善`request`方法。

### 合并选项

紧接着`request`会将`defaults`和传入的`options`进行合并。

```javascript
// lib/core/Axios.js
const mergeConfig = require('./mergeConfig')

Axios.prototype.request = function (configOrUrl, config) {
  // ...

  // 合并选项
  config = mergeConfig(this.defaults, config)

  // TODO
}
```

这里会用到`mergeConfig`方法，因此我们在`lib/core`新建一个`mergeConfig.js`，来实现`mergeConfig`方法。

而合并选项的逻辑其实很简单，这里就不多说了。这里只列出`mini-axios`会用到的选项，一些后面用到会提及到。

```javascript
/**
 * 合并处理选项
 * @param config1
 * @param config2
 */
module.exports = function mergeConfig(config1, config2) {
  config2 = config2 || {}

  const mergeMap = {
    url: config2.url || config1.url, // 接口
    method: config2.method || config1.method, // 请求方法
    data: config2.data || config1.data, // 请求数据
    params: config2.params || config1.params, // 请求参数
    adapter: config2.adapter || config1.adapter, // 适配器
    transformRequest: config2.transformRequest || config1.transformRequest, // 请求数据转换
    transformResponse: config2.transformResponse || config1.transformResponse, // 响应数据转换
    cancelToken: config2.cancelToken || config1.cancelToken, // 取消请求
    validateStatus: config2.validateStatus || config1.validateStatus, // 有效状态码
  }

  const config = {}
  // 去除无值选项
  Object.keys(mergeMap).forEach((key) => {
    if (mergeMap[key] !== undefined) {
      config[key] = mergeMap[key]
    }
  })

  return config
}
```

### 派发请求

处理完选项后，就要开始请求接口了。

而这里会实现一个`dispatchRequest`派发请求的方法，然后使用`promise`进行调用触发。

```javascript
// lib/core/Axios.js
const dispatchRequest = require('./dispatchRequest')

Axios.prototype.request = function (configOrUrl, config) {
  // ...

  // 派发请求
  let promise = Promise.resolve(config).then(dispatchRequest)

  return promise
}
```

现在`request`方法基本上就完成了。

## `dispatchRequest` 派发请求

前面我们讲到`request`最后通过`promise`封装`dispatchRequest`，然后链式调用进行派发请求。从上面的代码可以得
知`dispatchRequest`会接收到`config`参数。

接下来，我们就来实现`dispatchRequest`。我们先在`lib/core`下新建`dispatchRequest.js`文件。

```javascript
// lib/core/dispatchRequest.js
/**
 * 派发请求
 * @param config
 */
module.exports = function dispatchRequest(config) {
  // TODO
}
```

首先我们先初始化`headers`，因为后续的请求数据转换用使用`headers`。

```javascript
// lib/core/dispatchRequest.js
module.exports = function dispatchRequest(config) {
  config.headers = config.headers || {}

  // TODO
}
```

接下来就是我们说的请求数据转换，说白了就是对请求数据进行统一处理，而这个默认处理函数是在`defaults.js`实现。

其次，`transformRequest`选项是个数组，如果用户传入的话会与默认数组进行合并，进行处理。（emm，我`mergeConfig`就直接二选一
了）。

这里我们就只实现一下一些简单的数据转换。

```javascript
// lib/defaults.js
const defaults = {
  // ...
  transformRequest: [
    function transformRequest(data, headers) {
      // 默认header参数
      headers['Accept'] = 'application/json, text/plain, */*'

      if (!data) {
        return data
      }

      // 根据header类型配置Content-type
      if (typeof data === 'object') {
        headers['Content-Type'] = 'application/json'
        return JSON.stringify(data)
      }
      return data
    },
  ],
}
```

接下来，我们需要用到另一个函数`transformData`，帮我们去遍历`transformRequest`数组，一一调用去转换数据。

因此我们在`lib/core`下面新建一个`transformData.js`，它接收`data`请求数据、`header`请求头和`fns`数据集合三个参数。

```javascript
// lib/core/transformData.js
const defaults = require('../defaults')

/**
 * 数据转换
 * @param data 请求数据
 * @param headers 请求头
 * @param fns 转换方法集合
 * @return {*}
 */
module.exports = function transformData(data, headers, fns) {
  const context = this || defaults

  fns.forEach((fn) => {
    data = fn.call(context, data, headers)
  })

  return data
}
```

最后我们在`dispatchRequest`调用：

```javascript
// lib/core/dispatchRequest.js
module.exports = function dispatchRequest(config) {
  config.headers = config.headers || {}

  // 调用转换函数处理数据
  config.data = transformData.call(config, config.data, config.headers, config.transformRequest)

  // TODO
}
```

处理完请求数据后，我们就需要调用适配器，进行调用请求。

前面初始化适配器的时候可以看到，适配器最后会返回一个`promise`，因此我们调用适配器后可以链式统一处理成功或失败结果。

```javascript
// lib/core/dispatchRequest.js
module.exports = function dispatchRequest(config) {
  // ...

  // 获取适配器
  const adapter = config.adapter || defaults.adapter

  return adapter(config).then(
    // 成功处理
    function (response) {
      return response
    },
    // 错误处理
    function (reason) {
      return Promise.reject(reason)
    }
  )
}
```

接下来我们来实现适配器。

## 适配器实现

我们先来实现`xhr.js`。

### XHR 适配器实现

如果写过`ajax`的话，下面大部分实现都不陌生：

- 初始化请求：`let request = new XMLHttpRequest()`;
- 启动请求：`request.open(method, url, async)`
- 设置请求头：`request.setRequestHeader`
- 监听请求状态：`request.onreadystatechange`
- 监听终止请求：`request.onabort`
- 监听接口报错：`request.onerror`

这里启动请求的`url`需要考虑拼接`params`参数，源码是自己去实现拼接，我偷懒就直接用了`qs`模块（`pnpm i qs`）。

```javascript
// lib/adapters/xhr.js
/**
 * 封装 XMLHttpRequest
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    const requestData = config.data
    const requestHeaders = config.headers

    let request = new XMLHttpRequest()

    // 启动请求
    request.open(config.method.toUpperCase(), config.params ? config.url + '?' + qs.stringify(config.params) : config.url, true)

    // 监听请求状态
    request.onreadystatechange = function () {
      // 只有当请求完成时（readyState === 4）才会往下处理
      if (!request || request.readyState !== 4) {
        return
      }

      // 需要注意的是，如果 XMLHttpRequest 请求出错，大部分的情况下我们可以通过监听 onerror 进行处理，
      // 但是也有一个例外，当请求使用文件协议（file://）时，尽管请求成功了但是大部分浏览器也会返回 0 的状态码
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return
      }

      // 异步处理
      setTimeout(function onloadend() {
        if (!request) return
        // 响应头
        const responseHeaders = request.getAllResponseHeaders()
        // 响应数据
        const responseData = request.response
        const response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request,
        }

        // TODO 响应数据处理
      })
    }

    // 监听终止请求
    request.onabort = function () {
      if (!request) return

      const error = new Error('Request aborted')
      error.code = 'ECONNABORTED'
      reject(error)

      request = null
    }

    // 监听接口报错
    request.onerror = function () {
      reject(new Error('Network Error'))
      request = null
    }

    // 设置请求头
    if ('setRequestHeader' in request) {
      Object.keys(requestHeaders).forEach((key) => {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          delete requestHeaders[key]
        } else {
          request.setRequestHeader(key, requestHeaders[key])
        }
      })
    }

    // 发送请求
    request.send(requestData)
  })
}
```

上面把基本功能都实现了，剩下请求成功后响应数据处理，也就是在`request.onreadystatechange`监听中。

这里我们封装一个`settle`函数，统一处理响应结果，确保能按照一定的格式返回。

这里会实现一个核心内容，就是状态码判断。如果用过`axios`的朋友就会清楚，如果请求成功但状态码非`2xx`或`3xx`的话，默认情况
下是以错误返回的。这一步操作就是在这里处理。

而默认检验状态码的函数，还是在`defaults.js`里面配置。

```javascript
// lib/defaults.js
const defaults = {
  // ...

  // 有效状态码，不符合最后会reject回去
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300
  },
}
```

接下来我们来实现`settle`函数，在`lib/core`路径下新建一个`settle.js`。

```javascript
// lib/core/settle.js
/**
 * 处理适配器响应结果
 * @param resolve
 * @param reject
 * @param response
 */
module.exports = function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus
  // 校验有效状态码方法
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    // 错误处理
    const error = new Error('Request failed with status code ' + response.status)
    error.response = response
    error.toJSON = function () {
      return {
        message: this.message,
        status: this.response && this.response.status ? this.response.status : null,
      }
    }
    reject(error)
  }
}
```

紧接着我们在`xhr.js`适配器继续完善代码：

```javascript
// lib/adapters/xhr.js
const settle = require('../core/settle')

/**
 * 封装 XMLHttpRequest
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    // ...

    request.onreadystatechange = function () {
      // ...

      setTimeout(function onloadend() {
        // ...

        // 响应数据处理
        settle(resolve, reject, response)
      })
    }

    // ...
  })
}
```

这时候我们网页端请求功能基本实现。

### http 适配器实现

这边的实现逻辑基本跟`xhr.js`的实现差不多，主要的差异就是`xhr`和`http`的使用方法不同，关于`http` 模块的使用方法可以
看[文档](http://nodejs.cn/api/http.html#httprequestoptions-callback) ，这里就不多说了。

所以直接上代码：

```javascript
// lib/adapters/http.js
const url = require('url')
const http = require('http')
const https = require('https')
const settle = require('../core/settle')
const qs = require('qs')

const isHttps = /https:?/

/**
 * 封装 http 模块
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function httpAdapter(config) {
  return new Promise((resolve, reject) => {
    const data = config.data
    const headers = config.headers
    const headerNames = {} // header name 映射表

    Object.keys(headers).forEach((name) => {
      headerNames[name.toLowerCase()] = name
    })

    // 解析链接
    const parsed = url.parse(config.url)
    const protocol = parsed.protocol || 'http:'

    // 判断是否为https请求
    const isHttpsRequest = isHttps.test(protocol)

    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: config.params ? parsed.path + '?' + qs.stringify(config.params) : parsed.path,
      method: config.method.toUpperCase(),
      headers: headers,
    }

    // 获取请求适配器
    const transport = isHttpsRequest ? https : http

    // 创建请求
    const req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return

      const stream = res

      const response = {
        status: res.statusCode,
        statusText: res.statusText,
        headers: res.headers,
        config: config,
      }

      const responseBuffer = []
      let totalResponseBytes = 0
      // 响应监听
      stream.on('data', (chunk) => {
        responseBuffer.push(chunk)
        totalResponseBytes += chunk.length
      })

      // 监听取消请求
      stream.on('aborted', () => {
        // 销毁流
        stream.destroy()

        const error = new Error('Request aborted')
        error.code = 'ECONNABORTED'
        reject(error)
      })

      // 错误监听
      stream.on('error', (err) => {
        reject(err)
      })

      // 响应结束监听
      stream.on('end', () => {
        // 合并数据
        response.data = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer)
        settle(resolve, reject, response)
      })
    })

    req.on('error', (err) => {
      reject(err)
    })

    // 发送请求
    req.end(data)
  })
}
```

## 响应数据转换

现在实现了适配器的基本功能。我们就可以来测试一下。

我们先来测试网页。首先执行打包，然后在`dist`会生成`axios.min.js`文件。

接下来可以新建一个`index.html`来测试。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Mini-axios Example</title>
  </head>
  <body>
    <script src="../dist/axios.min.js"></script>
    <script>
      axios({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET',
        params: {
          userId: 1,
        },
      })
        .then((res) => {
          console.log('get success：', res.data, res.status)
        })
        .catch((err) => {
          console.log('get err', err)
        })

      axios({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        data: {
          title: 'foo',
          body: 'bar',
          userId: 1,
        },
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then((res) => {
          console.log('post success：', res.data, res.status)
        })
        .catch((err) => {
          console.log('post err', err)
        })
    </script>
  </body>
</html>
```

![](/posts/mini-axios/demo1.png)

接着我们在测试一下`node`端：

```javascript
const axios = require('../index')

axios({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'GET',
  params: {
    userId: 1,
  },
})
  .then((res) => {
    console.log('get success：', res.data, res.status)
  })
  .catch((err) => {
    console.log('get err', err)
  })

axios({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'POST',
  data: {
    title: 'foo',
    body: 'bar',
    userId: 1,
  },
  headers: {
    'Content-type': 'application/json',
  },
})
  .then((res) => {
    console.log('post success：', res.data, res.status)
  })
  .catch((err) => {
    console.log('post err', err)
  })
```

![](/posts/mini-axios/demo2.png)

这时候我们会发现，我们拿到的`data`，要么是字符串，要么是`Buffer`，而不是我们想要的`json`。因此我们就需要来做响应数据转换
。

有了前面的请求数据转换的经验，我们知道可以在`defaults.js`配置响应数据转换方法数组。

紧接着，我们如何将`string`或`Buffer`转成我们想要的`json`呢，其实就是调用`JSON.parse`就可以了。因此我们来实现一下：

```javascript
// lib/defaults.js
const defaults = {
  // ...

  // 默认的响应转换函数
  transformResponse: [
    function transformResponse(data) {
      try {
        return JSON.parse(data)
      } catch (e) {
        throw e
      }
    },
  ],
}
```

根据前面的代码实现，我们可以知道`dispatchRequest`是最后一个地方接触响应数据的，因此我们可以在`dispatchRequest`这里来转换
响应数据。

那么我们来完善一下代码：

```javascript
// lib/core/dispatchRequest.js
module.exports = function dispatchRequest(config) {
  config.headers = config.headers || {}

  // 调用转换函数处理数据
  config.data = transformData.call(config, config.data, config.headers, config.transformRequest)

  // 获取适配器
  const adapter = config.adapter || defaults.adapter

  return adapter(config).then(
    // 成功处理
    function (response) {
      // 处理response数据，核心是将字符串解析成对象
      response.data = transformData.call(config, response.data, response.headers, config.transformResponse)

      return response
    },
    // 错误处理
    function (reason) {
      if (reason && reason.response) {
        // 处理response数据，核心是将字符串解析成对象
        reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse)
      }

      return Promise.reject(reason)
    }
  )
}
```

接下来我们再来看一下测试：

![](/posts/mini-axios/demo3.png)

![](/posts/mini-axios/demo4.png)

这时候我们的`mini-axios`的基本功能已经实现了。

接下来我们来实现两个扩展功能——拦截器和取消请求。

## 拦截器

我们先来看看 [官方文档](https://axios-http.com/zh/docs/interceptors) 对拦截器的解释：

> 在请求或响应被 then 或 catch 处理前拦截它们。
>
> ```javascript
> // 添加请求拦截器
> axios.interceptors.request.use(
>   function (config) {
>     // 在发送请求之前做些什么
>     return config
>   },
>   function (error) {
>     // 对请求错误做些什么
>     return Promise.reject(error)
>   }
> )
>
> // 添加响应拦截器
> axios.interceptors.response.use(
>   function (response) {
>     // 2xx 范围内的状态码都会触发该函数。
>     // 对响应数据做点什么
>     return response
>   },
>   function (error) {
>     // 超出 2xx 范围的状态码都会触发该函数。
>     // 对响应错误做点什么
>     return Promise.reject(error)
>   }
> )
> ```

其实这个功能很简单理解。而实现上，我们得捋一捋。

首先得在`axios`实现`interceptors`对象，里面包含`request`和`response`对象，而它们都有一样的`use`方法，它用来存储我们的拦
截器方法，因此我们可以用一个类来实现。

紧接着，在派发请求之前，需要先触发请求拦截器，请求完但返回结果之前，我们需要触发响应拦截器，而这个我们可以使用队列
和`Promise`的链式调用来配合使用。

捋完了，我们来实现叭。

首先我们可以在`Axios`类来创建`interceptors`实例属性，毕竟后面全都会挂载到`axios`上。

```javascript
const InterceptorManager = require('./InterceptorManager')

// lib/core/Axios.js
function Axios(instanceConfig) {
  this.defaults = instanceConfig
  // 拦截器
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  }
}
```

紧接着我们来实现`InterceptorManager`类。首先在`lib/core`新建`InterceptorManager.js`。

```javascript
// lib/core/InterceptorManager.js
// 拦截器
function InterceptorManager() {
  // 存储拦截器容器
  this.handlers = []
}

module.exports = InterceptorManager
```

紧接着我们来实现`use`实例方法，它其实就一个功能，就是把传入的拦截处理函数保存到`handlers`。

```javascript
// lib/core/InterceptorManager.js
/**
 * 创建一个拦截器
 * @param fulfilled
 * @param rejected
 * @return {number}
 */
InterceptorManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
  })

  // 使用下标作为 id
  return this.handlers.length - 1
}
```

同时我们可以再实现一个示例方法`forEach`，即遍历`this.handler`且调用传入的回调函数。

该方法是为了后续提取所有拦截器。

```javascript
// lib/core/InterceptorManager.js
/**
 * 遍历调用
 * @param fn
 */
InterceptorManager.prototype.forEach = function (fn) {
  this.handlers.forEach((h) => {
    if (h !== null) {
      fn(h)
    }
  })
}
```

最后，我们回到`Axios.prototype.request`方法中，我们想要在派发请求之前，需要先触发请求拦截器，请求完但返回结果之前，我们
需要触发响应拦截器。

因此我们可以新建队列，把请求拦截器放最前面，把派发请求放中间，把响应拦截放最后。

最后我们可以使用`promise.then().then()`这种链式调用去每一个。

而这里我们有个问题就是我们传入的拦截器包含`fulfilled`函数和`rejected`函数，因此我们可以这么调
用`promise.then(fulfilled, rejected).then(fulfilled, rejected)`。

因此我们队列就可以把拦截器拆开，比如：`[fulfilled, rejected, fulfilled, rejected]`， 然后两个两个调用`then`。

而问题在于，如果我们队列再插入`dispatchRequest`派发请求，则队列长度就变成了奇数，因此我们需要在`dispatchRequest`后面插入
一个`undefined`凑数，确保队列长度奇数。

可能现在看着有点乱，我们直接看代码：

```javascript
// lib/core/Axios.js
Axios.prototype.request = function (configOrUrl, config) {
  // ...

  // 请求的拦截器队列
  const requestInterceptorChain = []
  this.interceptors.request.forEach(function (interceptor) {
    // 将请求拦截回调倒序放入 requestInterceptorChain
    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected)
  })

  const responseInterceptorChain = []
  this.interceptors.response.forEach(function (interceptor) {
    // 将响应拦截回调顺序放入 responseInterceptorChain
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected)
  })

  // chain 队列用来存储和管理实际请求和拦截器
  // undefined 是为了保存队列长度为偶数
  let chain = [dispatchRequest, undefined]
  // 将请求拦截器放入 chain 队头
  Array.prototype.unshift.apply(chain, requestInterceptorChain)
  // 将响应拦截器放入 chain 队尾
  chain = chain.concat(responseInterceptorChain)

  // 初始化Promise
  let promise = Promise.resolve(config)
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift())
  }

  return promise
}
```

这时候拦截器基本实现了，我们可以来测试一下代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Mini-axios Example</title>
  </head>
  <body>
    <script src="../dist/axios.min.js"></script>
    <script>
      axios.interceptors.request.use(
        function (config) {
          console.log('interceptors request', config)
          return config
        },
        function (error) {
          return Promise.reject(error)
        }
      )

      axios.interceptors.response.use(
        function (response) {
          console.log('interceptors response', response)
          return response
        },
        function (error) {
          return Promise.reject(error)
        }
      )

      axios({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'GET',
        params: {
          userId: 1,
        },
      })
        .then((res) => {
          console.log('get success：', res.data, res.status)
        })
        .catch((err) => {
          console.log('get err', err)
        })
    </script>
  </body>
</html>
```

![](/posts/mini-axios/demo5.png)

```javascript
const axios = require('../index')

axios.interceptors.request.use(
  function (config) {
    console.log('interceptors request', config)
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    console.log('interceptors response', response)
    return response
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'GET',
  params: {
    userId: 1,
  },
})
  .then((res) => {
    console.log('get success：', res.data, res.status)
  })
  .catch((err) => {
    console.log('get err', err)
  })
```

![](/posts/mini-axios/demo6.png)

## 取消请求

`axios`实现取消请求有两种方法：

```javascript
// 方法一
const CancelToken = axios.CancelToken
let cancel

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c
  }),
})

// 取消请求
cancel()
```

```javascript
// 方法二
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.get('/user/12345', {
  cancelToken: source.token,
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.')
```

其实这两个方法的核心就是使用`CancelToken`类，然后创建一个示例绑定到`options`选项中的`cancelToken`选项，然后获取取消函
数`cancel`，然后当你想要取消请求的时候只需要调用`cancel`函数即可。

而方法一和方法二的区别在于，方法一更适用于给不同的请求设置不同的取消函数，以便于更精确的取消对应请求；而方法二更适用于通
过一个取消函数来取消所有的请求，因为它们都是使用同一个`cancelToken`。

虽然使用上有所不同，但是实现基本上没有什么区别，无非就是方法二的`source`方法提前帮我们做了方法一的操作罢了。

废话不多说，我们来实现吧。

首先我们在`lib`新建一个`cancel`路径，然后新建一个`CancelToken.js`。紧接着我们初始化一下`CancelToken`类，根据上面的使用我
们可以知道它接收一个`executor`执行函数。

```javascript
// lib/cancel/CancelToken.js
function CancelToken(executor) {
  // TODO
}

module.exports = CancelToken
```

然后我们可以回头将其挂载到`axios`的属性上。

```javascript
// lib/axios.js
const CancelToken = require('./cancel/CancelToken')

axios.CancelToken = CancelToken
```

初始化工作做好了，我们继续来完成`CancelToken`功能。

通过前面两个例子我们可以发现`executor`函数会接收一个`cancel`取消函数，并且这个`cancel`函数可以接收一个`message`取消原因
的参数。

因此我们实现一下：

```javascript
// lib/cancel/CancelToken.js
function CancelToken(executor) {
  executor(function cancel(message) {
    // TODO
  })
}
```

接下来先来解决一下取消原因`message`，在`axios`源码实现上，`CancelToken`会有一个`reason`实例属性，它一方面存储`message`取
消原因，一方面可以用来判断用户是否执行了取消函数。

再者，`aixos`不会直接将`message`赋值到`reason`实例属性上，而是用了一个`Cancel`类来创建一个实例，并传入`message`，然后实
例赋值给`reason`。

我们可以先来实现，然后再说一下为什么怎么做。现在`lib/cancel`新建一个`Cancel.js`。

```javascript
// lib/cancel/Cancel.js
function Cancel(message) {
  this.message = message
}

module.exports = Cancel
```

可以看到，`Cancel`类其实简单，但为什么要多此一举来新建一个类呢？

有些人可以会觉得这个类有点眼熟，跟`Error`类差不多，每次我们拿到`err`错误都会打印`err.message`来看看错误信息。

所以`axios`也是基于这个思路，毕竟我们取消请求后，都是需要`reject(err)`错误或者`throw err`返回错误。而一般取消请求，不会
有太多的错误请求，因此我们可以直接自己创建一个`Cancel`，然后创建一个`reason`实例，当取消请求的时候，我们就可以直
接`reject(reason)`或者`throw reason`。

因此我们继续来完善`CancelToken`。

```javascript
// lib/cancel/CancelToken.js
function CancelToken(executor) {
  const token = this
  executor(function cancel(message) {
    // 如果有实例上已经有reason，代表已经取消了，无需再次取消
    if (token.reason) return

    token.reason = new Cancel(message)
    // TODO
  })
}
```

接下来就剩下取消请求的实现了。

首先`CancelToken`实例上会有一个`_listeners`数组，它存储着绑定该`cancelToken`的请求的取消函数。因此我们只需要遍
历`_listeners`数组，一一调用取消函数就可以了。

而在这里会使用一个异步去实现，这样子才能确保取消的时候对应请求的取消函数已经存入`_listreners`对象中，因为这一步基本上是
在适配器里面操作，而通过前面实现可以配发请求也是在一个异步队列中，因此我们需要把取消动作也放入异步队列中去。

因此我们可以创建`CancelToken`实例的时候，在实例挂载一个`promise`，然后再`then`实现取消操作，同时我们把`resolve`暴露出来
。因此我们调用`cancel`函数的时候，就可以触发这个暴露出来的`resolve`，进而触发`promise.then`。

```javascript
// lib/cancel/CancelToken.js
function CancelToken(executor) {
  let resolvePromise

  // 实例化时会在实例上挂载一个 promise
  // 这个 promise 的 resolve 回调暴露给了外部方法 executor
  this.promise = new Promise((resolve) => {
    resolvePromise = resolve
  })

  const token = this

  this.promise.then((cancel) => {
    if (!token._listeners) return

    for (let i = 0; i < token._listeners.length; i++) {
      token._listeners[i](cancel)
    }
    token._listeners = null
  })

  executor(function cancel(message) {
    // 如果有实例上已经有reason，代表已经取消了，无需再次取消
    if (token.reason) {
      return
    }

    token.reason = new Cancel(message)
    // 执行resolvePromise会直接调用this.promise.then方法
    resolvePromise(token.reason)
  })
}
```

接下来我们再来实现一下订阅取消请求函数方法和取消订阅取消请求函数方法，这个很简单，无非就是将取消请求函数插
入`_listeners`数组和移除`_listeners`数组。

```javascript
// lib/cancel/CancelToken.js

/**
 * 订阅取消请求函数
 * @param listener
 */
CancelToken.prototype.subscribe = function (listener) {
  // 如果有this.reason，证明此时已经开始取消请求了
  // 因此立即执行取消动作
  if (this.reason) {
    listener(this.reason)
    return
  }

  // 存储到 this._listeners 中
  if (this._listeners) {
    this._listeners.push(listener)
  } else {
    this._listeners = [listener]
  }
}

/**
 * 取消订阅，删除取消请求函数
 * @param listener
 */
CancelToken.prototype.unsubscribe = function (listener) {
  if (!this._listeners) return

  const index = this._listeners.indexOf(listener)
  if (index !== -1) {
  }
  this._listeners.splice(index, 1)
}
```

接下来，我们先去`xhr`适配器实现取消请求函数。对于`XMLHttpRequest`，想要取消请求只需要调用`abort()`方法即可。

其次就订阅和取消订阅了。订阅就不用多说了，初始化完就马上订阅。而取消订阅的话，但请求结束后，我们就得执行取消订阅，因此我
们可以封装一个`done`方法，并且在最后处理响应时调用。

```javascript
// lib/adapters/xhr.js
const settle = require('../core/settle')
const Cancel = require('../cancel/Cancel')

/**
 * 封装 XMLHttpRequest
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    // ...

    // 取消请求
    let onCanceled

    // 请求结束处理函数
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled)
      }
    }

    // ...

    // 监听请求状态
    request.onreadystatechange = function () {
      // ...

      // 处理响应
      settle(
        (value) => {
          resolve(value)
          done()
        },
        (err) => {
          reject(err)
          done()
        },
        response
      )
    }

    // ...

    // 处理取消请求
    if (config.cancelToken) {
      onCanceled = function (cancel) {
        reject(cancel || new Cancel('canceled'))
        request.abort()
        request = null
      }

      config.cancelToken.subscribe(onCanceled)
    }

    // ...
  })
}
```

对于`http`适配器也是相同道理，这里就不多说了。

```javascript
// lib/adpters/http.js
const settle = require('../core/settle')
const Cancel = require('../cancel/Cancel')

/**
 * 封装 http 模块
 * @param config
 * @return {Promise<unknown>}
 */
module.exports = function httpAdapter(config) {
  return new Promise((resolvePromise, rejectPromise) => {
    let onCanceled

    // 请求结束处理函数
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled)
      }
    }

    // 包装resolve函数
    const resolve = function (value) {
      done()
      resolvePromise(value)
    }

    // 包装reject函数
    const reject = function (value) {
      done()
      rejectPromise(value)
    }

    // ...

    // 创建请求
    const req = transport.request(options, function handleResponse(res) {
      // ...

      // 响应结束监听
      stream.on('end', () => {
        // ...

        settle(resolve, reject, response)
      })
    })

    // ...

    // 初始化取消函数
    if (config.cancelToken) {
      onCanceled = function (cancel) {
        // 如果请求已经取消了，就不必再调用
        if (req.aborted) return

        // 调用取消请求
        req.abort()
        reject(cancel || new Cancel('canceled'))
      }

      // 订阅取消函数
      config.cancelToken.subscribe(onCanceled)
    }

    // ...
  })
}
```

那现在取消请求的基本功能已经实现了。

在`axios`源码中其实它在请求前和请求后最后处理结果的时候，也会检测是否执行取消请求操作了。我们也可以跟着实现试一下。

上面说的基本都是在`dispatchRequest`中，我们实现一个`throwIfCancellationRequested`函数，然后判断配置是否有`cancelToken`选
项，有的话再判断实例中是否有`reason`实例属性，有的话就证明已经调用取消请求函数了，因此就使用`throw reason``报错，不再进
行执行了。

```javascript
// lib/core/dispatchRequest.js

function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequest()
  }
}

/**
 * 派发请求
 * @param config
 */
module.exports = function dispatchRequest(config) {
  // 检测是否已经触发取消请求动作
  throwIfCancellationRequested(config)

  // ...

  return adapter(config).then(
    // 成功处理
    function (response) {
      // 检测是否已经触发取消请求动作
      throwIfCancellationRequested(config)

      // ...
    },
    // 错误处理
    function (reason) {
      // 检测是否已经触发取消请求动作
      throwIfCancellationRequested(config)

      // ...
    }
  )
}
```

```javascript
// lib/cancel/CancelToken.js
/**
 * 请求前取消
 */
CancelToken.prototype.throwIfRequest = function () {
  if (this.reason) {
    throw this.reason
  }
}
```

最后，我们来实现`CancelToken.source`。也就是第二个取消方法的实现，其实就是把方法一的代码搬过来就行，然后将实例和取消函数
返回处理。

```javascript
// lib/cancel/CancelToken.js
CancelToken.source = function () {
  let cancel
  const token = new CancelToken(function (c) {
    cancel = c
  })
  return {
    token: token, // CancelToken实例
    cancel: cancel, // 取消函数
  }
}
```

最后的最后，我们测试一下叭。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Mini-axios Example</title>
  </head>
  <body>
    <script src="../dist/axios.min.js"></script>
    <script>
      let cancel
      axios({
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        method: 'GET',
        cancelToken: new axios.CancelToken(function executor(c) {
          // executor 函数接收一个 cancel 函数作为参数
          cancel = c
        }),
      })
        .then((res) => {
          console.log('get success：', res.data, res.status)
        })
        .catch((err) => {
          console.log('get err', err)
        })

      setTimeout(() => {
        cancel('取消请求')
      })
    </script>
  </body>
</html>
```

![](/posts/mini-axios/demo7.png)

![](/posts/mini-axios/demo8.png)

```javascript
const axios = require('../index')

let cancel

axios({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  method: 'GET',
  cancelToken: new axios.CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c
  }),
})
  .then((res) => {
    console.log('get success：', res.data, res.status)
  })
  .catch((err) => {
    console.log('get err', err)
  })

setTimeout(() => {
  cancel('取消请求')
})
```

![](/posts/mini-axios/demo9.png)

测试成功，这时候我们的`mini-axios`就实现了。
