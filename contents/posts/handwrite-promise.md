---
title: 手撕一个符合Promise/A+规范的Promise
description: 手撕一个符合Promise/A+规范的Promise
date: 2022-02-09T08:00:00.000+00:00
author: Dewey Ou
---

> [github](https://github.com/ouduidui/javascript-wheels/tree/master/src/promise/api)

## 什么是 Promise

> 首先先带大家过一遍`Promise`，这不是基础教学，如果没用`Promise`的朋友可以先去学一学。

`ECMAScript6`提供了`Promise`对象，而它最主要的作用，就是用来**监听一个异步操作的完成或失败**。

在没有`Promise`之前，我们想要监听一个异步操作的结束然后执行某些操作的时候，一般都是通过回调函数来实现，最典型的例子就是`setTimeout`。

```javascript
setTimeout(() => {
  doSomething()
}, 1000)
```

上面的例子，实现了一个定时器，在 1 秒后触发执行回到函数，进而执行`doSomething()`函数。

但如果，我们想在 1 秒后，再设置一个定时器的话：

```javascript
setTimeout(() => {
  setTimeout(() => {
    doSomething()
  }, 1000)
}, 1000)
```

甚至说再来几个的话：

```javascript
setTimeout(() => {
  setTimeout(() => {
    setTimeout(() => {
      setTimeout(() => {
        doSomething()
      }, 1000)
    }, 1000)
  }, 1000)
}, 1000)
```

这就是很典型的**回调地狱**了。而回调地狱，最明显的缺点，就是嵌套太多，大大影响了代码的可读性和逻辑。

而这种案例在现实项目中其实并不少见，有时候我们一个页面需要请求多个接口，而一些接口的请求数据需要依赖上一个接口的响应数据，这时候就不得不得等待上一个接口的响应。

而`Promise`的诞生，很好的解决了`回调地狱`这个问题。

首先我们可以创建一个`Promise`示例，然后传入一个执行函数`executor`。这个`executor`函数接收两个参数，分别为`resolve`函数和`reject`函数。

```javascript
new Promise((resolve, reject) => {
  // doSomething
})
```

先来说说`resolve`函数。它实质上是用来改变`Promise`的状态，就是告诉`Promise`说异步函数执行成功了。因此，我们在异步操作执行结束的时候，需要调用一下`resolve`函数。

同时，`resolve`函数可以接收一个参数`value`，它是作为异步操作成功的返回值，传递给下一步操作。

相反的，`reject`函数就是代表异步操作执行失败了，同时它也可以接收一个参数`reason`，作为异步操作失败的原因。

```javascript
new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      // 执行成功
      resolve('success')
    }, 1000)
  } catch (e) {
    // 执行失败
    reject('fail')
  }
})
```

紧接着，我们可以调用`Promise`的实例方法`then`，来执行异步完成后的操作。

`then`方法接收两个参数，即`onFulfilled`处理函数和`onRejected`处理函数。

- `onFulfilled`函数即在异步操作执行成功后被调用，即上面执行`resolve`函数。并且它会接收一个`value`参数，即调用`resolve`时传入的参数。

- `onRejected`函数即在异步操作执行失败后被调用，即上面执行`reject`函数。并且它会接收一个`reason`参数，即调用`reject`时传入的参数。

```javascript
new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      // 执行成功
      resolve('success')
    }, 1000)
  } catch (e) {
    // 执行失败
    reject('fail')
  }
}).then(
  // onFulfilled处理函数
  (value) => {
    console.log(value) // 'success'
  },
  // onRejected处理函数
  (reason) => {
    console.log(reason) // 'fail'
  }
)
```

`Promse`还提供了`catch`实例方法，可以单独处理错误情况。

```javascript
new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      // 执行成功
      resolve('success')
    }, 1000)
  } catch (e) {
    // 执行失败
    reject('fail')
  }
})
  .then(
    // onFulfilled处理函数
    (value) => {
      console.log(value) // 'success'
    }
  )
  .catch(
    // onRejected处理函数
    (reason) => {
      console.log(reason) // 'fail'
    }
  )
```

接下来，我们就用使用`Promise`来改造前面的回调地狱。

其实看上面的代码，我们可以发现`Promise`的另一个特性，就是链式调用，就是下面这个样子。

```javascript
new Promise().then().then().then().then()
```

因此，我们可以在上一个`then`再执行一个异步操作。但这时候问题就出现了，在`then`里面是没有`resolve`和`reject`函数的。

这时我们在里面新建一个`Promise`示例，执行异步操作。然后再将这个实例返回出去。此时`then`执行`onFulfilled`函数接收到了一个`Promise`实例，它会将这个实例的`then`操作绑定到下一个`then`操作中。

```javascript
new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve('success 1')
    }, 1000)
  } catch (e) {
    reject('fail')
  }
})
  .then((value) => {
    console.log(value) // success 1
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          resolve('success 2')
        }, 1000)
      } catch (e) {
        reject('fail')
      }
    })
  })
  .then((value) => {
    console.log(value) // success 2
  })
```

到这里我们了解了`Promise`的基本使用。

> 关于`Promise`还有很多需要学习的地方，比如实例方法`finally`，静态方法`all`、`allSellled`、`resolve`、`reject`、`any`、`race`。这些在后面的实现上会简单讲一下。
>
> 其次就关于`Promise`的执行时序，实际上就是关于 JavaScript 的事件循环 EvenLoop，大家可以自己去学习，也可以参考一下我的文章[《做一些动图，学习一下 EventLoop》](https://ouduidui.cn/front-end/javascript/event-loop.html#%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF-event-loop)。
>
> 其次还有关于`async/await`，其实就是将`Promise`操作变成一个同步操作的语法糖。

最后，我们需要简单学习一下`Promise`的状态。`Promise`实质上有三种状态：

- _待定（pending）_: 初始状态，既没有被兑现，也没有被拒绝。

- _已兑现（fulfilled）_: 意味着操作成功完成。

- _已拒绝（rejected）_: 意味着操作失败。

每当我们初始化`Promise`实例后，它默认状态为`pending`，然后当我们调用`resolve`函数时，它的状态就会变成`fulfilled`，如果我们调用的是`reject`函数时，它的状态就会变成`rejected`。

而且，当状态处于`fulfilled`和`rejected`的时候，是不会再进行状态变化了。

因此，一个`Promise`实例的状态变化只会有以下三种可能：

- `pending` -> `fulfilled`，此时会调用`then`实例方法中的`onFulfilled`函数

- `pending` -> `rejected`，此时会调用`then`实例方法中的`onRejected`函数和`catch`实例方法中的回调函数。

- 一直处于`pending`，也就是在异步操作中没有执行`resolve`和`reject`函数，这种情况也不会触发`then`、`catch`和`finnlly`实例方法。

这时可能大家会有一个疑问，就是前面的用`Promise`改造回调地狱的实现中，好像存在两次`pending` -> `fulfilled`的情况。

其实上面的代码等同于下面的代码：

```javascript
new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      // 执行成功
      resolve('success 1')
    }, 1000)
  } catch (e) {
    // 执行失败
    reject('fail')
  }
}).then((value) => {
  console.log(value)
  new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve('success 2')
      }, 1000)
    } catch (e) {
      reject('fail')
    }
  }).then((value) => {
    console.log(value)
  })
})
```

因此实质上它里面是存在两个`Promise`实例的，因此也会存在两个状态变化。

而之所以可以写成之前的写法，是因为`Promise`中会去识别`onFulfilled`函数和`onRejected`函数的返回值，如果是一个`Promise`实例的话，它会将它的`then`绑定到自身的下一个`then`操作上。

## 实现 Promise

> [代码 Github](https://github.com/ouduidui/fe-study/blob/master/package/javascript/wheels/src/promise/api/index.js)

### 初始化

在前面我们提到过，`Promise`是一个对象。然后在实践上，我们会通过`new`关键字去构造`Promise`实例。因此`Promise`是一个构造函数，或者说，`Promise`是一个类。（JavaScript 本身是没有类这一说的，`class` 只是实现构造函数的语法糖）

因此我们可以初始化一下`Promise`。

```javascript
class Promise {
  constructor() {}
}
```

其次我们使用一个`PROMISE_STATE`常量对象，来存储`Promise`三种状态，并且在构造函数初始化一下状态。

```javascript
const PROMISE_STATE = {
  PENDING: 'pending', // 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝
  FULFILLED: 'fulfilled', // 已兑现（fulfilled）: 意味着操作成功完成
  REJECTED: 'rejected', // 已拒绝（rejected）: 意味着操作失败
}

class Promise {
  constructor(executor) {
    // 初始化状态
    this.promiseState = PROMISE_STATE.PENDING
  }
}
```

### 实现构造函数

通过前面的讲解，我们知道新建`Promise`实例时，需要传入一个执行函数`executor`，并且这个执行函数会接收两个参数，分别为`onFulfilled`函数和`onRejected`函数。

```javascript
class Promise {
  constructor(executor) {
    // 初始化状态
    this.promiseState = PROMISE_STATE.PENDING

    // 初始化resolve函数和reject函数
    const resolve = (value) => {}
    const reject = (reason) => {}

    try {
      // 执行 executor 函数
      executor(resolve, reject)
    } catch (e) {
      // 如果executor执行报错，则调用reject
      reject(e)
    }
  }
}
```

接下来来实现`resolve`和`reject`函数，它们的功能其实差不多。

- 首先是判断状态是否为`pending`，不是的话就不继续执行了。

- 如果是`pending`状态的话，则改变状态。

- 然后保存`value`值或`reason`值。

- 最后执行`onFulfilled`函数或`onRejected`函数。

前面几步其实都不难，主要在于最后一步。

实际上，在`Promise`中会有有两个实例属性`onResolvedCallbacks`和`onRejectedCallbacks`，即两个数组。

在`then`操作和`catch`操作中，它们会把所有的`onFulfilled`函数和`onRejected`函数保存到这两个实例数组中。

因此在`resolve`和`reject`方法中，只需要遍历对应数组一一执行即可。

```javascript
class Promise {
  constructor(executor) {
    // ...

    // 成功的值
    this.value = undefined
    // 存储 onFulfilled 的数组
    this.onResolvedCallbacks = []

    const resolve = (value) => {
      // 只能在状态为pending的时候执行
      if (this.promiseState === PROMISE_STATE.PENDING) {
        this.promiseState = PROMISE_STATE.FULFILLED // 修改状态
        this.value = value // 保存值
        this.onResolvedCallbacks.forEach((fn) => fn()) // 调用所有 onFulfilled 回调
      }
    }

    // 失败的原因
    this.reason = undefined
    // 存储onRejected的数组
    this.onRejectedCallbacks = []

    const reject = (reason) => {
      if (this.promiseState === PROMISE_STATE.PENDING) {
        this.promiseState = PROMISE_STATE.REJECTED // 修改状态
        this.reason = reason // 保存失败原因
        this.onRejectedCallbacks.forEach((fn) => fn()) // 调用所有 onRejectedCallbacks 回调
      }
    }

    // ...
  }
}
```

这时候，构造函数的实现就完成了。

### 实现实例方法 —— then

> [Promise.prototype.then() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)

在`then`方法中，主要是实现以下几个事情：

- 判断状态

  - 如果是`fulfilled`，异步执行`onFulfilled`函数

  - 如果是`rejected`，异步执行`onRejected`函数

  - 如果是`pending`，将`onFulfilled`，`onRejected`分别存入`onResolvedCallbacks`和`onRejectedCallbacks`数组中

- 不管是执行还是存入数组，都需要封装一层进行异步执行

- 返回一个新的`promise`，实现链式调用

这里比较难的是第二点——异步执行，我们可以先来看看下面的代码：

```javascript
new Promise((resolve) => {
  console.log(1)
  resolve(2)
}).then((res) => {
  console.log(res)
})
console.log(3)
```

如果用过`Promise`的或者刷过`Promise`面试题的或者了解 EvenLoop 的朋友都会知道，最终的执行结果是`1->3->2`，尽管`executor`操作不是异步操作。

我们可以从 EvenLoop 的角度简单讲一下。

- 按照从上往下的执行顺序，首先会执行`executor`函数，即首先输出`1`。

- 其次执行了`resolve`函数，`promise`实例变成`fulfilled`状态，因此`onFulfilled`函数被进入微任务队列。

- 接下来跳出`Promise`，执行`console.log(3)`。

- 此时所有同步函数执行完成了，就开始清空微任务队列，即执行`console.log(res)`，输出`2`。

而我们可以反向推一下，`onFulfilled`进入到微任务队列，而微任务队列其实是异步队列，因此`then`操作会将`onFulfilled`包装成异步操作。

而在我们实现上，我们会使用`setTimeout`来模拟异步实现。

讲完原理，我们一步步来实现。

首先我们简单处理一下传入`onFulfilled`函数和`onRejected`函数，因为这两个都是可选参数。

```javascript
class Promise {
  // ...

  then(onFulfilled, onRejected) {
    // 处理 onFulfilled 回调
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    // 处理 onRejected 回调
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err
          }
  }
}
```

其次，我们初始化一个`Promise`实例，并将其返回。

```javascript
class Promise {
  // ...

  then(onFulfilled, onRejected) {
    // ...

    const newPromise = new Promise((resolve, reject) => {})

    return newPromise
  }
}
```

接下来，我们来定义一个公用的异步处理函数`asyncHandler`，用于封装`onFulfilled`函数和`onRejected`函数。

```javascript
class Promise {
  // ...

  then(onFulfilled, onRejected) {
    // ...

    const newPromise = new Promise((resolve, reject) => {
      const asyncHandler = (fn) => {
        // 使用setTimeout来模拟异步操作
        setTimeout(() => {
          try {
            // 得到返回值
            const res = fn()
            // TODO 处理结果值
          } catch (e) {
            reject(e)
          }
        })
      }
    })

    return newPromise
  }
}
```

紧接着，我们就可以将`onFulfilled`和`onRejected`包裹起来。这里别忘记了`onFulfilled`调用时需要传入`value`参数，`onRejected`调用时需要传入`reason`参数。

```javascript
class Promise {
  // ...

  then(onFulfilled, onRejected) {
    // ...

    const newPromise = new Promise((resolve, reject) => {
      // ...

      // 使用异步处理函数包裹onFulfilled和onRejected
      const fulfilledHandler = () => asyncHandler(() => onFulfilled(this.value))
      const rejectedHandler = () => asyncHandler(() => onRejected(this.reason))
    })

    return newPromise
  }
}
```

紧接着，我们就通过判断状态分别处理`fulfilledHandler`和`rejectedHandler`。

```javascript
class Promise {
  // ...

  then(onFulfilled, onRejected) {
    // ...

    const newPromise = new Promise((resolve, reject) => {
      // ...

      // 状态为fulfilled的时候，异步执行onFulfilled，并传入this.value
      if (this.promiseState === PROMISE_STATE.FULFILLED) {
        fulfilledHandler()
      }
      // 状态为rejected的时候，onRejected，并传入this.reason
      else if (this.promiseState === PROMISE_STATE.REJECTED) {
        rejectedHandler()
      }
      // 状态为pending的时候，将onFulfilled、onRejected存入数组
      else if (this.promiseState === PROMISE_STATE.PENDING) {
        this.onResolvedCallbacks.push(fulfilledHandler)
        this.onRejectedCallbacks.push(rejectedHandler)
      }
    })

    return newPromise
  }
}
```

这时候`then`的实现已经搞一段落。

但里面还有一个`TODO`还没完成，也就是在`asyncHandler`函数中，我们执行完`onFulfilled`或`onRejected`后得到返回值，需要进行处理。

因此我们可以封装一个`resolvePromise`函数来进行统一处理。而因为我们外面包了一层`promise`，因此我们处理将返回值传给`resolvePromise`之外，也需要将`newPromise`、`resolve`和`reject`也传入，便于修改这个内部`promise`实例的状态。

```javascript
class Promise {
  // ...

  then(onFulfilled, onRejected) {
    // ...

    const newPromise = new Promise((resolve, reject) => {
      // ...

      const asyncHandler = (fn) => {
        setTimeout(() => {
          try {
            const res = fn()
            // 处理返回值
            resolvePromise(newPromise, res, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

      // ...
    })

    return newPromise
  }
}

function resolvePromise(newPromise, res, resolve, reject) {}
```

#### 实现 resolvePromise 函数

首先，我们需要做一层边缘检测，就是避免循环引用。

```javascript
function resolvePromise(newPromise, res, resolve, reject) {
  // 避免循环引用使用
  if (res === newPromise) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
}
```

其实，我们需要判断是否为对象或函数，如果不是的话直接`resolve`值即可。

```javascript
function resolvePromise(newPromise, res, resolve, reject) {
  // ...

  if (res != null && (typeof res === 'object' || typeof res === 'function')) {
    // TODO
  } else {
    resolve(res)
  }
}
```

紧接着，如果`res`是一个对象或函数的话，判断`res.then()`是否为一个函数，不是的话也是直接返回结果。是的话则调用`then`函数。

这里可能大家会有个疑问，为什么不直接用`res instanceof Promise`来判断`res`是否为`Promise`。这是因为，这里不仅仅只有`Promise`这种情况，我们可以先运行一下下面的代码：

```javascript
new Promise((resolve) => {
  resolve({
    then(resolve) {
      resolve(1)
    },
  })
})
  .then((res) => {
    return res
  })
  .then((res) => {
    console.log(res)
  })
```

上面的代码执行后，最终是会输出`1`。也就是说，但`onFulfilled`函数返回一个含有`then`函数的对象或函数，`Promise`也会去调用这个`then`函数。

我们继续完善代码：

```javascript
function resolvePromise(newPromise, res, resolve, reject) {
  // ...

  // 如果返回值为一个对象或者函数
  if (res != null && (typeof res === 'object' || typeof res === 'function')) {
    try {
      const then = res.then
      // 如果返回值是一个promise或者一个带有then函数的对象
      if (typeof then === 'function') {
        then.call(
          res,
          // onFulfilled 回调
          (r) => {
            resolvePromise(newPromise, r, resolve, reject)
          },
          // onRejected 回调
          (err) => {
            reject(err)
          }
        )
      } else {
        resolve(res)
      }
    } catch (e) {
      reject(e)
    }
  } else {
    // res 为普通的值，直接返回
    resolve(res)
  }
}
```

这时候`resolvePromise`的功能基本实现了。

最后还需要做一层边缘检测，就是避免多次调用`then`函数。因此使用一个`called`变量来检测。

```javascript
function resolvePromise(newPromise, res, resolve, reject) {
  // ...

  // 防止多次调用
  let called = false
  if (res != null && (typeof res === 'object' || typeof res === 'function')) {
    try {
      const then = res.then
      if (typeof then === 'function') {
        then.call(
          res,
          (r) => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            resolvePromise(newPromise, r, resolve, reject)
          },
          (err) => {
            // 成功和失败只能调用一个
            if (called) return
            called = true
            reject(err)
          }
        )
      } else {
        resolve(res)
      }
    } catch (e) {
      // 成功和失败只能调用一个
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(res)
  }
}
```

### 实现实例方法 —— catch

> [Promise.prototype.catch() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

上面已经实现了`then`方法，而`catch`实例方法接收的`onRejected`函数实质上跟`then`的`onRejected`一致。因此我们可以通过调用`then`来实现`catch`。

```javascript
class Promise {
  // ...

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}
```

### 实现静态方法 —— resolve

> [Promise.resolve() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)

`Promise.resolve`方法会新建一个`Promise`实例，然后将其绑定`value`值并将状态设置为`fulfilled`，并将其返回。

实质上就是新建一个`Promise`实例并调用了`resolve`方法并将其返回。

```javascript
class Promise {
  // ...

  static resolve(value) {
    return new Promise((resolve) => resolve(value))
  }
}
```

### 实现静态方法 —— reject

> [Promise.reject() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)

`Promise.reject`类似于`Promise.resolve`，它返回一个带有拒绝原因的`Promise`实例。

```javascript
class Promise {
  // ...

  static reject(reason) {
    return new Promise((resolve, reject) => reject(reason))
  }
}
```

### 实现实例方法 —— finally

> [Promise.prototype.finally() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)

`Promise.prototype.finally`会在`promise`结束时，无论结果是`fulfilled`或者是`rejected`，都会执行指定的回调函数。这避免了同样的语句需要在`then()`和`catch()`中各写一次的情况。

```javascript
class Promise {
  // ...

  finally(onFinally) {
    return this.then(
      (res) => Promise.resolve(onFinally()).then(() => res),
      (err) =>
        Promise.reject(onFinally()).then(() => {
          throw err
        })
    )
  }
}
```

### 实现静态方法 —— all

> [Promise.all() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

`Promise.all`会接收一个存放一个或多个`Promise`实例的数组，然后将其封装成一个`Promise`实例返回，并且这个实例的`resolve`回调的结果也是一个数组。

我们可以通过下面的代码来了解一下：

```javascript
const promise1 = Promise.resolve(3)
const promise2 = 42
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo')
})

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values) // [3, 42, "foo"]
})
```

但如果在执行过程中，数组中但凡有一个`Promise`实例执行错误的话，`Promise.all`返回的`Promise`实例也会直接抛出错误，不会输出已完成的结果或者继续执行未完成的`Promise`实例。

因此我们可以简单实现一下：

```javascript
class Promise {
  // ...

  static all(promises) {
    const results = []

    return new Promise((resolve, reject) => {
      if (!promises.length) resolve(results)
      // 遍历promises一一执行
      for (const promise of promises) {
        promise.then(
          (res) => {
            // 保存结果值
            results.push(res)
            // 当results和promises长度一致，则代表所有 promise 执行完成了
            if (results.length === promises.length) {
              resolve(results)
            }
          },
          // 但凡有一个promise执行报错，直接reject回去
          reject
        )
      }
    })
  }
}
```

### 实现静态方法 —— allSettled

> [Promise.allSettled() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled)

`Promise.allSettled`与`Promise.all`类似，也是接收一个`Promise`实例数组，返回一个新的`Promise`实例。

而区别在于`Promise.allSettled`不管数组中的`Promise`实例是成功完成或者执行失败，都会对成功值或者失败原因进行报错，以及还会保存 `Promise`实例的状态，最后返回一个结果数组。

我们同样通过一个代码案例来看一下：

```javascript
const promise1 = Promise.resolve(3)
const promise2 = new Promise((resolve, reject) =>
  setTimeout(() => {
    reject('foo')
  }, 100)
)
const promises = [promise1, promise2]

Promise.allSettled(promises).then((results) => {
  console.log(results) // [{ status: "fulfilled", value: 3 },  { status: "rejected", reason: "foo" }]
})
```

接下来我们来实现一下：

```javascript
class Promise {
  // ...

  static allSettled(promises) {
    const results = []

    return new Promise((resolve, reject) => {
      try {
        if (!promises.length) resolve(results)

        // 遍历promises一一执行
        for (const promise of promises) {
          promise.then(
            (res) => processData({ status: PROMISE_STATE.FULFILLED, value: res }),
            (err) => processData({ status: PROMISE_STATE.REJECTED, reason: err })
          )
        }

        // 处理数据
        function processData(res) {
          results.push(res)
          if (results.length === promises.length) {
            resolve(results)
          }
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}
```

### 实现静态方法 —— race

> [Promise.race() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)

`Promise.race` 方法同样接收一个`Promise`实例数组，返回一个新的`Promise`实例。一旦数组中的某个`Promise`执行成功或执行失败，返回的`Promise`实例就会返回该实例的结果。

简单来说，`Promise.race`返回的`Promise`实例最终的结果，即传入的数组中最快执行结束的`Promise`实例的结果，不管它是成功还是失败。

同样我们通过下面的代码来学习一下：

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 500)
})

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(2), 100)
})

Promise.race([promise1, promise2]).then((value) => {
  console.log(value) // 2  因为promise2更快完成
})

const promise3 = new Promise((resolve, reject) => {
  setTimeout(() => reject(3), 500)
})

const promise4 = new Promise((resolve, reject) => {
  setTimeout(() => reject(4), 100)
})

Promise.race([promise3, promise4]).catch((reason) => {
  console.log(reason) // 4  因为promise4更快完成
})
```

接下来我们就来实现一下：

```javascript
class Promise {
  // ...

  static race(promises) {
    return new Promise((resolve, reject) => {
      for (const promise of promises) {
        promise.then(resolve, reject)
      }
    })
  }
}
```

### 实现静态方法 —— any

> [Promise.any() - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any)

`Promise.any` 方法跟`Promise.race`类似，同样接收一个`Promise`实例数组，返回一个新的`Promise`实例。

他们的区别在于，`Promise.any`返回第一个成功的`Promise`实例，如果是执行失败的话，则会跳过执行下一个。如果所有的`Promise`实例都执行失败了，即抛出错误。

同样我们通过一段代码来看一下：

```javascript
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => resolve(1), 500)
})

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => reject(2), 100)
})

Promise.any([promise1, promise2]).then((value) => {
  console.log(value) // 1  尽管promise2先执行好，但是它是执行失败，直接跳过
})
```

### 测试

如果你会`jest`或其他测试工具，我会建议你每实现一个功能之前，先写一个该功能的测试用例。在这里分享一下我在实现时自己写的[测试用例](https://github.com/ouduidui/fe-study/blob/master/package/javascript/wheels/__test__/promise/api.spec.js)。

从日常的学习实践上，养成单测习惯，对日后的工作和学习都是有好处的。

> 我现在重读红宝书也写 [测试用例](https://github.com/ouduidui/fe-study/blob/master/package/javascript/professional-javascript-4/__test__/3-grammar-basic/3-3.spec.js)来进行学习的，还是比较爽的哈哈哈

而对于`Promise`的单元测试，那一定得是 Promise/A+测试。

> [Promise/A+规范](https://github.com/promises-aplus/promises-spec)
>
> [Promise/A+测试工具](https://github.com/promises-aplus/promises-tests)

首先得安装一下相关插件：

```shell
npm install promises-aplus-tests -D
```

紧接着，在你的文件中`index.js`插入一下代码：

```javascript
// 测试
Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}
module.exports = Promise
```

然后执行下面命令进行测试：

```shell
promises-aplus-tests Promise.js
```

一共是 872 个测试用例，如果通过都会就会显示：

```shell
 872 passing (17s)
```

而对于`Promise/A+`规范，跟原生的`Promise`还是有一定的区别，如果你想更深入的学习`Promise`的话，可以阅读下面这篇文章。

> [V8 Promise 源码全面解读 - 掘金](https://juejin.cn/post/7055202073511460895)
