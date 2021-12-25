---
lang: zh-CN
title:  手写Promise
description:  手写Promise，通过Promise/A+的872个测试
---

# 手写Promise，通过Promise/A+的872个测试

> [github](https://github.com/OUDUIDUI/fe-study/tree/master/package/javascript/wheels/src/others/promise)

## `Promise`的声明

当我们使用`Promise`的时候，通常都是`new Promise((resolve, reject) => {})`。

因此我们可以看出：

- `Promise`是一个类；
- `Promise`类的构造函数的第一个参数是函数，这个函数叫处理器函数（`executor function`）；
- 而在处理器函数中，有了两个参数：`resolve`和`reject`
  - 当异步任务顺利完成且返回结果值的时候，我们会调用`resolve`函数；
  - 当异步任务失败且返回失败原因（通常是一个错误对象）时，会调用`reject`函数。

因此，我们可以初步声明一下`Promise`类。

```javascript
class Promise {
  /**
   * 构造器
   * @returns {Promise<object>}
   * @param executor<function>: executor有两个参数：resolve和reject
   */
  constructor(executor) {
    // resolve 成功
    const resolve = () => {
    };

    // reject 失败
    const reject = () => {
    };

    // 执行 executor
    executor(resolve, reject);
  }
}
```

## 实现Promise的基本状态

`Promise`存在着三种状态：`pending`（等待态）、`fulfilled`（成功态）和`rejected`（失败态）：

- `Promise`的初始状态是`pending`状态；
- `pending`状态可以转换为`fulfilled`状态和`rejected`状态；
- `fulfilled`状态不可以转为其他状态，且必须有一个不可改变的值（value）；
- `rejected`状态不可以转为其他状态，且必须有一个不可改变的原因（reason）；
- 当在处理器函数中调用`resolve`函数并传入参数value，则状态改变为`fulfilled`，且不可以改变；
- 当在处理器函数中调用`reject`函数并传入参数reason，则状态改变为`rejected`，且不可以改变；
- 若处理器函数执行中报错，直接执行`reject`函数。

因此，我们需要在`Promise`类中设置三个变量：`state`（状态变量），`value`（成功值的变量）和`reason`（失败原因的变量），然后在`resolve`函数、`reject`函数以及执行`executor`
函数报错的时候改变`state`的值。

```javascript
class Promise {
  constructor(executor) {
    // 初始化状态
    this.state = 'pending';
    // 成功的值
    this.value = undefined;
    // 失败的原因
    this.reason = undefined;

    /**
     * resolve 成功函数
     * @param value<any>: 成功的值
     */
    const resolve = (value) => {
      // 只能在状态为pending的时候执行
      if (this.state === 'pending') {
        // resolve调用后，state转化为fulfilled
        this.state = 'fulfilled';
        // 存储value
        this.value = value;
      }
    };

    /**
     * reject 失败函数
     * @param reason<any>: 失败的原因
     */
    const reject = (reason) => {
      // 只能在状态为pending的时候执行
      if (this.state === 'pending') {
        // resolve调用后，state转化为rejected
        this.state = 'rejected';
        // 存储reason
        this.reason = reason;
      }
    };

    // 如果executor执行报错，直接执行reject()
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
}
```

## `then`方法

`Promise`有一个`then`方法，而该方法中有两个参数：`onFulfilled`和`onRejected`：

- 这两个参数都是一个函数，且会返回一个结果值；
- 当状态为`fulfilled`，只执行`onFulfilled`，传入`this.value`；
- 当状态为`rejected`，只执行`onRejected`，传入`this.reason`；

因此我们可以来实现一下`then`方法。

```javascript
class Promise {
  constructor(executor) {
    ...
  }

  /**
   * then 方法
   * @param onFulfilled<function>: 状态为fulfilled时调用
   * @param onRejected<function>: 状态为rejected时调用
   */
  then(onFulfilled, onRejected) {
    // 状态为fulfilled的时候，执行onFulfilled，并传入this.value
    if (this.state === 'fulfilled') {
      /**
       * onFulfilled 方法
       * @param value<function>: 成功的结果
       */
      onFulfilled(this.value)
    }

    // 状态为rejected的时候，onRejected，并传入this.reason
    if (this.state === 'rejected') {
      /**
       * onRejected 方法
       * @param reason<function>: 失败的原因
       */
      onRejected(this.reason)
    }
  }
}
```

## 异步实现

`Promise`实际上一个异步操作：

- `resolve()`是在`setTimeout`内执行的；
- 当执行`then()`函数时，如果状态是`pending`时，我们需要等待状态结束后，才继续执行，因此此时我们需要将`then()`的两个参数`onFulfilled`和`onRejected`存起来；
- 因为一个`Promise`实例可以调用多次`then()`，因此我们需要将`onFulfilled`和`onRejected`各种用数组存起来。

因此我们可以借着完善代码：

```javascript
class Promise {
  /**
   * 构造器
   * @returns {Promise<object>}
   * @param executor<function>: executor有两个参数：resolve和reject
   */
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    // 存储onFulfilled的数组
    this.onResolvedCallbacks = [];
    // 存储onRejected的数组
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // 一旦resolve执行，调用onResolvedCallbacks数组的函数
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        // 一旦reject执行，调用onRejectedCallbacks数组的函数
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      onFulfilled(this.value)
    }


    if (this.state === 'rejected') {
      onRejected(this.reason)
    }

    // 状态为pending的时候，将onFulfilled、onRejected存入数组
    if (this.state === 'pending') {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}
```

## 实现链式调用

我们常常会像下面代码一样使用`Promise`：

```javascript
new Promise()
  .then()
  .then()
  .then()
```

这种方法叫做**链式调用**，通常是用来解决回调地狱（`Callback Hell`）的，就如下的代码：

```javascript
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    files.forEach(function (filename, fileIndex) {
      console.log(filename)
      gm(source + filename).size(function (err, values) {
        if (err) {
          console.log('Error identifying file size: ' + err)
        } else {
          console.log(filename + ' : ' + values)
          aspect = (values.width / values.height)
          widths.forEach(function (width, widthIndex) {
            height = Math.round(width / aspect)
            console.log('resizing ' + filename + 'to ' + height + 'x' + height)
            this.resize(width, height).write(dest + 'w' + width + '_' + filename, function (err) {
              if (err) console.log('Error writing file: ' + err)
            })
          }.bind(this))
        }
      })
    })
  }
})
```

为了实现链式调用，我们需要满足一下几点：

- 我们需要在`then()`返回一个新的`Promise`实例；
- 如果上一个`then()`返回了一个值，则这个值就是`onFulfilled()`或者`onRejected()`的值，我们需要把这个值传递到下一个`then()`中。

而对于上一个`then()`的返回值，我们需要对齐进行一定的处理，因此封装一个`resolvePromise()`的方法去进行判断处理；

接下来我们对`then()`方法进行修改：

```javascript
class Promise {
  constructor(executor) {
    ...
  }

  /**
   * then 方法
   * @returns {Promise<object>}
   * @param onFulfilled<function>: 状态为fulfilled时调用
   * @param onRejected<function>: 状态为rejected时调用
   */
  then(onFulfilled, onRejected) {
    // 返回一个新的Promise实例
    const newPromise = new Promise((resolve, reject) => {

      if (this.state === 'fulfilled') {
        const x = onFulfilled(this.value)

        // 对返回值进行处理 
        resolvePromise(newPromise, x, resolve, reject);
      }

      if (this.state === 'rejected') {
        const x = onRejected(this.reason);

        // 对返回值进行处理 
        resolvePromise(x, resolve, reject);
      }

      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          const x = onFulfilled(this.value);

          // 对返回值进行处理 
          resolvePromise(newPromise, x, resolve, reject);
        })
        this.onRejectedCallbacks.push(() => {
          const x = onRejected(this.reason);

          // 对返回值进行处理 
          resolvePromise(newPromise, x, resolve, reject);
        })
      }
    });

    return newPromise;
  }
}

function resolvePromise() {
}
```

#### 完成`resolvePromise`函数

对于上一个`then()`的返回值，我们用`x`变量存起来，然后需要对它进行一个处理：

- 判断`x`是不是`Promise`实例；
  - 如果是`Promise`实例，则取它的结果，作为新的`Promise`实例成功的结果；
  - 如果是普通值，直接作为`Promise`成功的结果；

然后我们处理返回值后，需要利用`newPromise`的`resolve`和`reject`方法将结果返回。

这里我们还需要注意一个地方，就是`x`等于`newPromise`的话，这时会造成循环引用，导致死循环。

```javascript
let p = new Promise(resolve => {
  resolve(0);
});
const p2 = p.then(data => {
  // 循环引用，自己等待自己完成，导致死循环
  return p2;
})
```

因此，`resolvePromise`函数需要4个参数，即`newPromise`，`x`、`resolve`和`reject`。

所以我们来实现一下`resolvePromise`函数：

```javascript
/**
 * resolvePromise 方法
 * @param newPromise<object>: 新的Promise实例
 * @param x<any>: 上一个then()的返回值
 * @param resolve<function>：Promise实例的resolve方法
 * @param reject<function>：Promise实例的reject方法
 */
function resolvePromise(newPromise, x, resolve, reject) {
  // 循环引用报错
  if (x === newPromise) {
    // reject报错
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  // 防止多次调用
  let called;
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      // x 为Promise实例
      if (typeof then === 'function') {
        // 使用call执行then()，call的第一个参数是this，后续即then()的参数，即第二个是成功的回调方法，第三个为失败的回调函数
        then.call(x, y => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          // resolve 的结果依旧是promise实例，那就继续解析
          resolvePromise(newPromise, y, resolve, reject);
        }, err => {
          // 成功和失败只能调用一个
          if (called) return;
          called = true;
          // 失败了就直接返回reject报错
          reject(err);
        })
      } else {
        // x 为普通的对象或方法，直接返回
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // x 为普通的值，直接返回
    resolve(x);
  }
}
```

## `onFulfilled`和`onRejected`

关于`then()`的两个参数——`onFulfilled`和`onRejected`：

- 它们都是可选参数，而且它们都是函数，如果不是函数的话，就会被忽略掉；
  - 如果`onFulfilled`不是一个函数，就将它直接替换成函数`value => value`；
  - 如果`onRejected`不是一个函数，就将它直接替换成函数`err => {throw err}`;

```javascript
class Promise {
  constructor(executor) {
    ...
  }

  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接抛出错误
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    };

    ...
    
  }
}
```

其次，`onFulfilled`和`onRejected`是不能同步被调用的，必须异步调用。因此我们就用`setTimeout`解决一步问题。

```javascript
class Promise {
  constructor(executor) { ...
  }

  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接抛出错误
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    };

    return new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        // 异步调用
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === 'rejected') {
        // 异步调用
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);

            resolvePromise(x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          // 异步调用
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          // 异步调用
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(x, resolve, reject);
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    });
  }
}
```

## 实现`Promise`的其他方法

### `Promise.all()`

`Promise.all()`方法接收一个`promise`的`iterable`类型的输入，包括`Array`、`Map`、`Set`。然后返回一个`Promise`实例，该实例回调返回的结果是一个数组，包含输入所有`promise`
的回调结果。

但只要任何一个输入的`promise`的`reject`回调执行或者输入不合法的`promise`，就会立马抛出错误。

```javascript
/**
 * Promise.all 方法
 * @returns {Promise<object>}
 * @param promises<iterable>: 一个promise的iterable类型输入
 */
Promise.all = function (promises) {
  let arr = [];

  return new Promise((resolve, reject) => {
    if (!promises.length) resolve([]);
    // 遍历promises
    for (const promise of promises) {
      promise.then(res => {
        arr.push(res);
        if (arr.length === promises.length) {
          resolve(arr);
        }
      }, reject)
    }
  })
}
```

### `Promise.allSettled()`

`Promise.allSettled()`其实跟`Promise.all()`很像，同样是接收一个`promise`的`iterable`类型的输入，但返回的是一个给定的`promise`已经完成后的`promise`
，并带有一个对象数组，每个对象标识着对应的`promise`结果。

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
const promises = [promise1, promise2];

Promise.allSettled(promises).then((results) => console.log(results));
// > Array [Object { status: "fulfilled", value: 3 }, Object { status: "rejected", reason: "foo" }]
```

实现：

```javascript
/**
 * Promise.allSettled 方法
 * @returns {Promise<object>}
 * @param promises<iterable>: 一个promise的iterable类型输入
 */
Promise.allSettled = function (promises) {
  let arr = [];

  return new Promise((resolve, reject) => {
    try {
      const processData = (data) => {
        arr.push(data);
        if (arr.length === promises.length) {
          resolve(arr);
        }
      }

      if (!promises.length) resolve([]);
      // 遍历promises
      for (const promise of promises) {
        promise.then(res => {
          processData({state: 'fulfilled', value: res})
        }, err => {
          processData({state: 'rejected', reason: err})
        })
      }
    } catch (e) {
      reject(e)
    }
  })
}
```

### `Promise.any()`

`Promise.any()`跟`Promise.all()`和`Promise.allSettled()一样，同样是接收一个`promise`的`iterable`类型的输入。但只要其中的一个`promise`成功，就返回那个已经成功的`
promise`，但如果没有一个`promise`成功，就返回一个失败的`promise`。

```javascript
/**
 * Promise.any 方法
 * @returns {Promise<object>}
 * @param promises<iterable>: 一个promise的iterable类型输入
 */
Promise.any = function (promises) {
  return new Promise((resolve, reject) => {
    // 如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 Promise
    if (!promises.length) reject();
    // 如果传入的参数不包含任何 promise，则返回一个 异步完成 （asynchronously resolved）的 Promise。
    if (typeof promises[Symbol.iterator] !== 'function' ||
      promises === null ||
      typeof promises === 'string') {
      resolve()
    }

    let i = 0;
    // 遍历promises
    for (const promise of promises) {
      promise.then(res => {
        i++;
        resolve(res);
      }, err => {
        i++;
        if (i === promises.length) {
          reject(err);
        }
      })
    }
  })
}
```

### `Promise.race()`

`Promise.race()`，同样是接收一个`promise`的`iterable`类型的输入。一旦迭代器中的某个`promise`完成了，不管是成功还是失败，就会返回这个`promise`。

```javascript
/**
 * Promise.race 方法
 * @returns {Promise<object>}
 * @param promises<iterable>: 一个promise的iterable类型输入
 */
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      promise.then(resolve, reject)
    }
  })
}
```

### `Promise.reject()`和`Promise.resolve()`

`Promise.reject()`方法返回一个带有拒绝原因的`Promise`对象；`Promise.resolve()`方法返回一个以定值解析后的`Promise`对象。

```javascript
/**
 * Promise.reject 方法
 * @returns {Promise<object>}
 * @param val<any>
 */
Promise.reject = function (val) {
  return new Promise(reject => reject(val))
}

/**
 * Promise.resolve 方法
 * @returns {Promise<object>}
 * @param val<any>
 */
Promise.resolve = function (val) {
  return new Promise(resolve => resolve(val))
}
```

## `catch()`和`finally()`

`catch()`方法是用来处理失败的情况，它传入一个处理函数，然后返回一个`promise`实例。实际上它是`then()`的语法糖，只接受`rejected`态的数据。

`finally()`是在`promise`结束时，无论结果是`fufilled`还是`rejected`，都会执行指定的回调函数。同样也返回一个`promise`实例。

```javascript
class Promise {
  constructor(executor) {
    ...
  }

  then(onFulfilled, onRejected) {
    ...
  }

  /**
   * catch 方法
   * @returns {Promise<object>}
   * @param callback<function>: 处理函数
   */
  catch(callback) {
    return this.then(null, callback);
  }

  /**
   * finally 方法
   * @returns {Promise<object>}
   * @param callback<function>: 处理函数
   */
  finally(callback) {
    return this.then(res => {
      return Promise.resolve(callback()).then(() => res)
    }, err => {
      return Promise.reject(callback()).then(() => {
        throw err
      })
    })
  }
}
```

## Promise/A+测试

> `Promise/A+`规范: https://github.com/promises-aplus/promises-spec
>
> `Promise/A+`测试工具: https://github.com/promises-aplus/promises-tests

安装`promises-aplus-tests`插件。

```powershell
yarn add promises-aplus-tests
```

在`Promise.js`后面插入下列代码。

```javascript
// 测试
Promise.defer = Promise.deferred = function () {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
module.exports = Promise;
```

然后输入命令行进行测试。

```shell
promises-aplus-tests Promise.js
```

结果：

```powershell
872 passing (18s)
```

