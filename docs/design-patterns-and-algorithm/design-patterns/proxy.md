---
lang: zh-CN
title: 代理模式
description: 设计模式 - 代理模式
---

# 代理模式

**代理模式** （Proxy Pattern）又称委托模式，它为目标对象创造了一个代理对象，以控制对目标对象的访问。

代理模式把代理对象插入到访问者和目标对象之间，从而为访问者对目标对象的访问引入一定的间接性。正是这种间接性，给了代理对象很多操作空间，比如在调用目标对象前和调用后进行一些预操作和后操作，从而实现新的功能或者扩展目标的功能。

## 你曾见过的代理模式

明星总是有个助理，或者说经纪人，如果某导演来请这个明星演出，或者某个品牌来找明星做广告，需要经纪人帮明星做接洽工作。而且经纪人也起到过滤的作用，毕竟明星也不是什么电影和广告都会接。

再看另一个例子。打官司是件非常麻烦的事，包括查找法律条文、起草法律文书、法庭辩论、签署法律文件、申请法院执行等等流程。此时，当事人就可聘请代理律师来完成整个打官司的所有事务。当事人只需与代理律师签订全权委托协议，那么整个打官司的过程，当事人都可以不用出现。法院的一些复杂事务都可以通过代理律师来完成，而法院需要当事人完成某些工作的时候，比如出庭，代理律师才会通知当事人，并为当事人出谋划策。

在类似的场景中，有以下特点：

1. 导演/法院（访问者）对明星/当事人（目标）的访问都是通过经纪人/律师（代理）来完成；
2. 经纪人/律师（代理）对访问有过滤的功能；

## 示例的代码实现

我们使用 JavaScript 来将上面的明星例子实现一下：

```javascript
// 明星
const idol = {
  name: 'XXX',
  ads: [] // 手中的代言广告
};

// 经纪人
const proxyAssistant = {
  name: '经纪人',
  // 接代言广告
  receiveAds: function (ad) {
    if (ad.rewards > 100000) {
      // 代言费10w+才接
      idol.ads.push(ad);
    }
  }
};

// 测试用例
it('示例的代码实现', () => {
  const {idol, proxyAssistant} = require('../packages/proxy/idol');
  const ad1 = {rewards: 200000, name: '广告1'};
  const ad2 = {rewards: 10000, name: '广告2'};
  proxyAssistant.receiveAds(ad1);
  proxyAssistant.receiveAds(ad2);
  expect(idol.ads.includes(ad1)).toBe(true);
  expect(idol.ads.includes(ad2)).toBe(false);
});
```

这里我们通过经纪人的方式来和明星取得联系，经纪人会视条件过滤一部分合作请求。

## 代理模式的概念

对于上面的例子，明星就相当于被代理的目标对象（Target）,而经纪人就相当于代理对象（Proxy）,希望找明星代言的人是访问者（Visitor），他们直接找不到明星，只能找明星的经纪人来进行业务商洽。

所以代理模式主要有一下几个概念：

1. **Target**: 目标对象，也是被代理的对象，是具体业务的实际执行者；
2. **Proxy**：代理对象，负责引用目标对象，以及对访问的过滤和预处理

![proxy-1.png](/images/docs/design-patterns/proxy-1.png)

ES6原生提供了[`Proxy`构造函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
，这个构造函数可以很方便第创建代理对象：

```javascript
const proxy = new Proxy(target, handler);
```

参数`target`是被代理对象，`handler`用来设置代理行为。

这里使用`Proxy`来实现上面的例子。

```javascript
// 明星
const idol = {
  name: 'XXX',
  ads: [] // 手中的代言广告
};

// 经纪人
const proxyAssistant = {
  name: '经纪人',
  // 新建一个idolAds代理对象
  idolAds: new Proxy(idol.ads, {
    set(target, p, value) {
      // 代言费10w+才接
      if (value.rewards && value.rewards > 100000) {
        target[p] = value;
      }
      return true;
    }
  }),
  // 接代言广告
  receiveAds: function (ad) {
    this.idolAds.push(ad);
  }
};

// 测试用例
it('示例的代码实现 - proxy', () => {
  const {idol, proxyAssistant} = require('../packages/proxy/idolByProxy');
  const ad1 = {rewards: 200000, name: '广告1'};
  const ad2 = {rewards: 10000, name: '广告2'};
  proxyAssistant.receiveAds(ad1);
  proxyAssistant.receiveAds(ad2);
  expect(idol.ads.includes(ad1)).toBe(true);
  expect(idol.ads.includes(ad2)).toBe(false);
});
```

而在ES6之前，一般都是用[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
来完成相同的操作。

## 代理模式在实战中的应用

### 拦截器

上面使用代理模式代理对象的访问的方式，一般又被称为**拦截器**。

拦截器的思想在实战中应用非常多，比如我们在项目中经常使用 Axios 的实例来进行 HTTP 的请求，使用拦截器 interceptor 可以提前对 request 请求和 response 返回进行一些预处理，比如：

1. request 请求头的设置，和 Cookie 信息的设置；
2. 权限信息的预处理，常见的比如验权操作或者 Token 验证；
3. 数据格式的格式化，比如对组件绑定的 Date 类型的数据在请求前进行一些格式约定好的序列化操作；
4. 空字段的格式预处理，根据后端进行一些过滤操作；
5. response 的一些通用报错处理，比如使用 Message 控件抛出错误；

除了 HTTP 相关的拦截器之外，还有 vue-router、react-router 路由跳转的拦截器，可以进行一些路由跳转的预处理等操作。以 vue-router 的路由全局前置守卫为例：

```javascript
const router = new VueRouter({...})
router.beforeEach((to, from, next) => {
  // ...
  console.log(' beforeRouteEnter ! ')
  next()
})
```

也许你会有疑问，拦截器看起来似乎和装饰者模式很像，但是要注意装饰者模式和代理模式的区别，代理模式控制访问者对目标对象的访问，而装饰者模式只给目标对象添加功能，原有功能不变且可直接使用。

Axios 拦截器是可以取消请求的，vue-router
路由拦截器也可以进行路由截停和重定向等等复杂操作，这些场景下，无疑是代理模式，因为这里的拦截器控制了对目标对象的访问，如果没有进行访问控制而只进行消息预处理和后处理，那么则可以当作是装饰者模式。

### 前端框架的数据响应式

现在的很多前端框架或者状态管理框架都使用上面介绍的 `Object.defineProperty` 和 `Proxy` 来实现数据的响应式化，比如 Vue、Mobx、AvalonJS 等，Vue 2.x 与 AvalonJS 使用前者，而
Vue 3.x 与 Mobx 5.x 使用后者。

Vue 2.x 中通过 `Object.defineProperty` 来劫持各个属性的 `setter/getter`
，在数据变动时，通过发布-订阅模式发布消息给订阅者，触发相应的监听回调，从而实现数据的响应式化，也就是数据到视图的双向绑定。

为什么 Vue 2.x 到 3.x 要从 `Object.defineProperty` 改用 `Proxy` 呢，是因为前者的一些局限性，导致的以下缺陷：

1. 无法监听利用索引直接设置数组的一个项，例如：`vm.items[indexOfItem] = newValue`；
2. 无法监听数组的长度的修改，例如：`vm.items.length = newLength`；
3. 无法监听 ES6 的 Set、WeakSet、Map、WeakMap 的变化；
4. 无法监听 Class 类型的数据；
5. 无法监听对象属性的新加或者删除；

除此之外还有性能上的差异，基于这些原因，Vue 3.x 改用 Proxy 来实现数据监听了。当然缺点就是对 IE 用户的不友好，兼容性敏感的场景需要做一些取舍。

### 缓存代理

缓存代理，就是将复杂计算的结果缓存起来，下次传参一致时直接返回之前缓存的计算结果。

### 保护代理和虚拟代理

有的书籍中着重强调代理的两种形式：**保护代理**和**虚拟代理**：

1. **保护代理** ：当一个对象可能会收到大量请求时，可以设置保护代理，通过一些条件判断对请求进行过滤；
2. **虚拟代理** ：在程序中可以能有一些代价昂贵的操作，此时可以设置虚拟代理，虚拟代理会在适合的时候才执行操作。

保护代理其实就是对访问的过滤，之前的经纪人例子就属于这种类型。

而虚拟代理是为一个开销很大的操作先占位，之后再执行，比如：

1. 一个很大的图片加载前，一般使用菊花图、低质量图片等提前占位，优化图片加载导致白屏的情况；
2. 现在很流行的页面加载前使用骨架屏来提前占位，很多 WebApp 和 NativeApp 都采用这种方式来优化用户白屏体验；

![proxy-2](/images/docs/design-patterns/proxy-2.gif)

### 正向代理和反向代理

还有个经常用的例子是**反向代理**（Reverse Proxy），反向代理对应的是**正向代理**（Forward Proxy），他们的区别是：

1. **正向代理**：
   一般的访问流程是客户端直接向目标服务器发送请求并获取内容，使用正向代理后，客户端改为向代理服务器发送请求，并指定目标服务器（原始服务器），然后由代理服务器和原始服务器通信，转交请求并获得的内容，再返回给客户端。正向代理隐藏了真实的客户端，为客户端收发请求，使真实客户端对服务器不可见；
2. **反向代理**：
   与一般访问流程相比，使用反向代理后，直接收到请求的服务器是代理服务器，然后将请求转发给内部网络上真正进行处理的服务器，得到的结果返回给客户端。反向代理隐藏了真实的服务器，为服务器收发请求，使真实服务器对客户端不可见。

反向代理一般在处理跨域请求的时候比较常用，属于服务端开发人员的日常操作了，另外在缓存服务器、负载均衡服务器等等场景也是使用到代理模式的思想。

![proxy-3](/images/docs/design-patterns/proxy-3.png)

## 优缺点

代理模式的主要优点有：

1. 代理对象在访问者与目标对象之间可以起到**中介和保护目标对象**的作用；
2. 代理对象可以**扩展目标对象的功能**；
3. 代理模式能将访问者与目标对象分离，在一定程度上**降低了系统的耦合度**，如果我们希望适度扩展目标对象的一些功能，通过修改代理对象就可以了，符合开闭原则；

代理模式的缺点主要是增加了系统的复杂度，要斟酌当前场景是不是真的需要引入代理模式

## 其他相关模型

很多其他的模式，比如状态模式、策略模式、访问者模式其实也是使用了代理模式。

### 代理模式与适配器模式

代理模式和适配器模式都为另一个对象提供间接性的访问，他们的区别：

1. **适配器模式**： 主要用来解决接口之间不匹配的问题，通常是为所适配的对象提供一个不同的接口；
2. **代理模式**： 提供访问目标对象的间接访问，以及对目标对象功能的扩展，一般提供和目标对象一样的接口；

### 代理模式与装饰者模式

装饰者模式实现上和代理模式类似，都是在访问目标对象之前或者之后执行一些逻辑，但是目的和功能不同：

1. **装饰者模式**： 目的是为了方便地给目标对象添加功能，也就是动态地添加功能；
2. **代理模式**： 主要目的是控制其他访问者对目标对象的访问；