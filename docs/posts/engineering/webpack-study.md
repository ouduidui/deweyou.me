---
lang: zh-CN
title: 万字长文，带你从零学习Webpack
description: 万字长文，带你从零学习Webpack
date: 2022-03-13
---

# 万字长文，带你从零学习 Webpack

一直以为，我的`Webpack`就是复制粘贴的水平，而对`Webpack`的知识真的很模糊，甚至是纯小白。所以前段时间开始对`Webpack`进行比较系统的学习。

学习完成后，我抽空整理了笔记，前前后后也花了一周多。最后觉得可以分享出来，让对`Webpack`还很模糊的朋友，可以学习一下。

当然，读完本文，你会发现`Webpack`还有更多更深的东西值得我们去学习，因此这只是一个开始，从零开始。

## module、chunk 和 bundle

在学习`webpack`之前，我们需要先来捋一捋三个术语——`module`、`chunk`和`bundle`。

### 过一下概念

#### module

先看看`webpack`官方对`module`的解读：

> `Module`是离散功能块，相比于完整程序提供了更小的接触面。精心编写的模块提供了可靠的抽象和封装界限，使得应用程序中每个模块都具有条理清楚的设计和明确的目的。

其实简单来说，`module`模块就是我们编写的代码文件，比如`JavaScript`文件、`CSS`文件、`Image`文件、`Font`文件等等，它们都是属于`module`模块。而`module`模块的一个特点，就是可以被引入使用。

#### chunk

同样的先看看官方解读：

> 此 `webpack` 特定术语在内部用于管理捆绑过程。输出束（bundle）由块组成，其中有几种类型（例如 `entry` 和 `child` ）。通常，块直接与输出束 (`bundle`）相对应，但是，有些配置不会产生一对一的关系

其实`chunk`是`webpack`打包过程的中间产物，`webpack`会根据文件的引入关系生成`chunk`，也就是说一个`chunk`是由一个`module`或多个`module`组成的，这取决于有没有引入其他的`module`。

#### Bundle

先看看官方解读：

> `bundle` 由许多不同的模块生成，包含已经经过加载和编译过程的源文件的最终版本。

`bundle`其实是`webpack`的最终产物，通常来说，一个`bundle`对应这一个`chunk`。

#### 总结

其实`module`、`chunk`和`bundle`可以说是同一份代码在不同转换场景的不同名称：

- 我们编写的是`module`
- `webpack`处理时时`chunk`
- 最终生成供使用的是`bundle`

### 实践一下

我们通过一个小`demo`来过一下，现在有一个项目，路径如下：

```
src/
├── index.css
├── index.js
├── common.js
└── utils.js
```

然后我们有两个入口文件，一个是`index.js`，一个是`utils.js`，在`index.js`中引入了`index.css`和`common.js`。然后通过`webpack`打包出来了`index.bundle.css`、`index.bundle.js`和`utils.bundle.js`。

好，介绍完背景后，我们就可以来分析一下`module`、`chunk`和`bundle`。

首先，我们编写的代码，就是`module`，也就是说`index.css`、`common.js`、`index.js`和`utils.js`共四个`module`文件。

其次，我们有两个入口文件，分别为`index.js`和`utils.js`，并且它们最后是独立打包成`bundle`的，从而在`webpack`打包过程中就会形成两个`chunk`文件，而由`index.js`形成`chunk`还包含着`index.js`引入的`module`——`common.js`和`index.css`。

最后，我们打包出来了`index.bundle.css`、`index.bundle.js`和`uitls.bundle.js`，这三个也就是`bundle`文件。

![module-chunk-bundle.png](/images/docs/webpack-study/module-chunk-bundle.png)

最后，我们可以总结一下三者之间的关系：**一个`budnle`对应着一个`chunk`，一个`chunk`对应着一个或多个`module`**。

## 初始化 Webpack 项目

接下来，我们通过一步步实践，来慢慢学习`webpack`，这篇文章使用的是`webpack5`。

首先，新建一个项目文件夹，然后初始化项目。

```shell
yarn init -y
```

然后安装一下`webpack`。当我们使用`webpack`时，还需要安装`webpack-cli`。

因为`webpack`只是在开发环境才会使用到，所以我们只需要添加到`devDependencies`即可。

```shell
## webpack -> 5.47.0, webpack-cli-> 4.7.2
yarn add webpack webpack-cli -D
```

然后再项目中新建`src`路径，再新建一个`index.js`：

```javascript
console.log('Hello OUDUIDUI')
```

然后执行`npx webpack`，则执行`webpack`打包。这时你的项目就会多一个`dist`文件夹，并且在`dist`文件夹中会看到一个`main.js`，里面的代码跟`index.js`一样。

当然，我们可以在`package.json`中编辑`script`命令：

```json
{
  "scripts": {
    "dev": "webpack"
  }
}
```

然后执行`yarn dev`，也可以成功打包。

## Webpack 配置文件

如果使用过`webpack`的朋友应该知道，`webpack`其实有一个配置文件——`webpack.config.js`。

但为什么前面的初始化测试时，我们没有编辑配置文件却可以成功打包？这是因为`webpack`会有一个默认配置，当它检测到我们没有配置文件的时候，它默认会使用自己的默认配置。

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
}
```

首先，我们简单来过一下这些默认配置叭。

### entry 和 output

`entry`选项是用来配置入口文件的，它可以是字符串、数组或者对象类型。`webpack`默认只支持`js`和`json`文件作为入口文件，因此如果引入其他类型文件会保存。

`output`选项是设置输出配置，**该选项必须是对象类型**，不能是其它类型格式。在`output`对象中，必填的两个选项就是导出路径`path`和导出`bundle`文件名称`filename`。其中`path`选项必须为绝对路径。

`entry`和`output`的配置，对于不同的应用场景的配置也会有所不同。

#### 单入口单输出

我们最普遍的就是单个入口文件，然后打包成单个`bundle`文件。这种应用场景下，`entry`可以使用字符串的形式，则跟默认配置文件类似：

```javascript
entry: './src/index.js'
```

#### 多入口单输出

当我们的项目需要有多个入口文件，但只需要一个输出`bundle`的时候，这时候`entry`可以使用数组的形式：

```javascript
entry: ['./src/index_1.js', './src/index_2.js']
```

> **注意：此时其实只有一个 chunk**

#### 多入口多输出

当我们的项目同时多个入口文件，并且它们需要单独打包，也就是意味着会有多个`bundle`文件输出，此时我们的`entry`需要使用对象形式，并且对象`key`对应的对应`chunk`的名称。

```javascript
entry: {
  index: "./src/index.js",  // chunkName为index
  main: "./src/main.js"     // chunkName为main
}
```

此时，我们的`output.filename`也不能写死了，这时候`webpack`提供了一个占位符`[name]`给我们使用，它会自动替换为对应的`chunkName`。

```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].js'  // [name]占位符会自动替换为chunkName
}
```

根据上面的配置，最后会打包出`index.js`和`main.js`。

#### 补充

在单入口单输出的应用场景下，`entry`也可以使用对象的形式，从而来自定义`chunkName`，然后`output.filename`也使用`[name]`占位符来自动匹配。当然也可以使用数组，但是不太大必要。

当`entry`使用数组或字符串的时候，`chunkName`默认为`main`，因此如果`output.filename`使用`[name]`占位符的时候，会自动替换为`main`。

### mode

在前面的打包测试的时候，命令行都会报一个警告：

```shell
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
```

这是因为`webpack`需要我们配置`mode`选项。

webpack 给我们提供了三个选项，即`none`、`development`和`production`，而默认就是`production`。

三者的区别呢，在于`webpack`自带的代码压缩和优化插件使用。

- **`none`**：不使用任何默认优化选项；
- **`development`**：指的是开发环境，会默认开启一些有利于开发调试的选项，比如`NamedModulesPlugin`和`NamedChunksPlugin`，分别是给`module`和`chunk`
  命名的，而默认是一个数组，对应的`chunkName`也只是下标，不利于开发调试；
- **`production`**：指的是生产环境，则会开启代码压缩和代码性能优化的插件，从而打包出来的文件也相对`none`和`development`小很多。

> 当我们设置 `mode` 之后，我们可以在 `process.env .NODE_ENV` 获取到当前的环境

因此我们可以在配置文件上文件上配置`mode`：

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  // 设置mode
  mode: 'development',
}
```

`webpack`也给我们提供了另一种方式，就是在命令行中配置，也就是加上`--mode`：

```javascript
// package.json
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```

### devtool

聊完`mode`后，说到开发调试，不难想起的就是`sourceMap`。而我们可以在配置文件中，使用`devtool`开启它。

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  // 开启source-map
  devtool: 'source-map',
}
```

打包后，你的`dist`中就会多了一个`main.js.map`文件。

当然，官方不止提供这么一个选项，具体的可以去[官网](https://webpack.docschina.org/configuration/devtool/#devtool)看看，这里就说其他几个比较常用的选项。

- **`none`**：不会生成`sourceMap`；
- **`eval`**：每个模块都会使用`eval()`执行，不建议生成环境中使用；

- **`cheap-source-map`**：生成`sourceMap`，但是没有列映射，则只会提醒是在代码的第几行，不会提示到第几列；
- **`inline-source-map`**：会生成`sourceMap`，但不会生成`map`文件，而是将`sourceMap`放在打包文件中。

### module

前面我们有提到过，就是`webpack`的入口文件只能接收`JavaScript`文件和`JSON`文件。

但我们通常项目还会有其他类型的文件，比如`html`、`css`、图片、字体等等，这时候我们就需要用到第三方`loader`来帮助`webpack`来解析这些文件。理论上只要有相应的`loader`，就可以处理任何类型的文件。

> 在`webpack`[官网](https://webpack.docschina.org/loaders/)其实提供了很多`loader`，已经能满足我们日常使用，当然我们也可以去`github`找找别人写的`loader`或者自己手写`loader`来使用。

而对于`loader`的配置，是写着`module`选项里面的。`module`选项是一个对象，它里面有一个`rules`属性，是一个数组，在里面我们可以配置多个匹配规则。

而匹配规则是一个对象，会有`test`属性和`use`属性，`test`属性一般是正则表达式，用来识别文件类型，而`use`属性是一个数组，里面用来存放对该文件类型使用的`loader`。

```javascript
module: {
  rules: [
    {
      test: /\.css$/, // 识别css文件
      use: ['style-loader', 'css-loader'], // 对css文件使用的三个loader
    },
  ]
}
```

对于`use`数组的顺序是有要求的，`webpack`会根据**自后向前**的规则去执行`loader`。也就是说，上面的例子`webpack`会先执行`css-loader`，再执行`style-loader`。

其次，当我们需要对对应`loader`提供配置的时候，我们可以选用对象写法：

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          // loader名称
          loader: 'css-loader',
          // loader选项
          options: {
            ...
          }
        }
      ]
    }
  ]
}
```

在后面我们根据实际应用场景再讲讲`module`的使用。

### plugins

`webpack`还提供了一个`plugins`选项，让我们可以使用一些第三方插件，因此我们可以使用第三方插件来实现打包优化、资源管理、注入环境变量等任务。

> 同样的，`webpack`[官方](https://webpack.docschina.org/plugins/)也提供了很多`plugin`。

`plugins`选项是一个数组，里面可以放入多个`plugin`插件。

```javascript
plugins: [new htmlWebpackPlugin(), new CleanWebpackPlugin(), new miniCssExtractPlugin(), new TxtWebpackPlugin()]
```

而对于`plugins`数组对排序位置是没有要求，因为在`plugin`的实现中，`webpack`会通过打包过程的生命周期钩子，因此在插件逻辑中就已经设置好需要在哪个生命周期执行哪些任务。

## 实现一下常见的应用场景

### HTML 模板

当我们是`Web`项目的时候，我们必然会存在`html`文件去实现页面。

而对于其他类型的文件，比如`css`、图片、文件等等，我们是可以通过引入入口`js`文件，然后通过`loader`进行解析打包。而对于`html`文件，我们不可能将其引入到入口文件然后解析打包，反而我们还需要将打包出来的`bundle`文件引入`html`文件去使用，

因此，其实我们需要实现的操作只有两个，一个是复制一份`html`文件到打包路径下，另一个就是将打包出来的`bundle`文件自动引入到`html`文件中去。

这时候我们需要使用一个插件来实现这些功能——`html-webpack-plugin`。

```shell
## 5.3.2
yarn add html-webpack-plugin -D
```

安装插件后，我们先在`src`文件下新建一下`index.html`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Demo</title>
  </head>
  <body>
    <div>Hello World</div>
  </body>
</html>
```

这里面我们暂时不需要引入任何模块。

接下来配置一下`webpack`。一般`plugin`插件都是一个类，而我们需要在`plugins`选项中需要创建一个插件实例。

对于`htmlWebpackPlugin`插件，我们需要传入一些配置：`html`模板地址`template`和打包出来的文件名`filename`。

```javascript
const path = require('path')
// 引入htmlWebpackPlugin
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    // 使用htmlWebpackPlugin插件
    new htmlWebpackPlugin({
      // 指定html模板
      template: './src/index.html',
      // 自定义打包的文件名
      filename: 'index.html',
    }),
  ],
}
```

接下来执行一下打包，就会发现`dist`文件下会生成一个`index.html`。打开会发现，`webpack`会自动将`bundle`文件引入：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Webpack Demo</title>
    <script defer src="main.js"></script>
  </head>
  <body>
    <div>Hello World</div>
  </body>
</html>
```

如果我们有多个`chunk`的时候，我们可以指定该`html`要引入哪些`chunk`。在`htmlWebpackPlugin`配置中有一个`chunks`选项，是一个数组，你只需要加入你想引入的`chunkName`即可。

```javascript
const path = require('path')
// 引入htmlWebpackPlugin
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    main: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'], // 只引入index chunk
    }),
  ],
}
```

打包完成后，`dist`文件下会出现`index.html`、`index.js`和`main.js`，但是`index.html`只会引入`index.js`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script defer src="index.js"></script>
  </head>
  <body>
    HelloWorld！
  </body>
</html>
```

如果我们需要实现多页面的话，只需要再`new`一个`htmlWebpackPlugin`实例即可，这里就不再多说。

### 清理打包路径

在每次打包前，我们其实都需要去清空一下打包路径的文件。

如果文件重名的话，`webpack`还会自动覆盖，但是实际中我们都会在打包文件名称中加入哈希值，因此清空的操作不得不实现。

这时候我们需要使用一个插件——`clean-webpack-plugin`。

```shell
yarn add clean-webpack-plugin -D
```

然后只需引入到配置文件且在`plugins`配置就可以使用了。

```javascript
const path = require('path')
// 引入CleanWebpackPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    publicPath: '',
  },
  plugins: [
    // 使用CleanWebpackPlugin
    new CleanWebpackPlugin(),
  ],
}
```

有些情况下，我们不需要完全清空打包路径，这时候我们可以使用到一个选项，叫`cleanOnceBeforeBuildPatterns`，它是一个数组，默认是`[**/*]`，也就是清理`output.path`路径下所有东西。而你可以在里面输入只想删除的文件，同时我们可以输入不想删除的文件，只需要在前面加上一个`!`。

> 需要注意的是，`cleanOnceBeforeBuildPatterns`这个选项是可以删除打包路径下之外的文件，只需要你配上绝对路径的话。因此`CleanWebpackPlugin`还提供了一个选项供测试——`dry`，默认是为`false`，当你设置为`true`后，它就不会真正的执行删除，而是只会在命令行打印出被删除的文件，这样子更好的避免测试过程中误删。

```javascript
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js',
    publicPath: '',
  },
  plugins: [
    new CleanWebpackPlugin({
      // dry: true   // 打开可测试，不会真正执行删除动作
      cleanOnceBeforeBuildPatterns: [
        '**/*', // 删除dist路径下所有文件
        `!package.json`, // 不删除dist/package.json文件
      ],
    }),
  ],
}
```

### Webpack 本地服务

当我们使用`webpack`的时候，不仅仅只是用于打包文件，大部分我们还会依赖`webpack`来搭建本地服务，同时利用其热更新的功能，让我们更好的开发和调试代码。

接下来我们来安装一下`webpack-dev-server`：

```shell
## 版本为3.11.2
yarn add webpack-dev-server -D
```

然后执行下列代码开启服务：

```shell
npx webpack serve
```

或者在 package.json 配置一下：

```json
"scripts": {
  "serve": "webpack serve --mode development"
}
```

然后通过`yarn serve`运行。

这时，webpack 会默认开启`http://localhost:8080/`服务（具体看你们运行返回的代码），而该服务指向的是`dist/index.html`。

但你会发现，你的`dist`中其实是没有任何文件的，这是因为`webpack`将实时编译后的文件都保存到了内存当中。

#### webpack-dev-server 的好处

其实`webpack`自带提供了`--watch`命令，可以实现动态监听文件的改变并实时打包，输出新的打包文件。

但这种方案存在着几个缺点，一就是每次你一修改代码，webpack 就会全部文件进行重新打包，这时候每次更新打包的速度就会慢了很多；其次，这样的监听方式做不到热更新，即每次你修改代码后，webpack 重新编译打包后，你就得手动刷新浏览器，才能看到最新的页面结果。

而`webpack-dev-server`，却有效了弥补这两个问题。它的实现，是使用了`express`启动了一个`http`服务器，来伺候资源文件。然后这个`http`服务器和客户端使用了`websocket`通讯协议，当原始文件作出改动后，`webpack-dev-server`就会实时编译，然后将最后编译文件实时渲染到页面上。

#### webpack-dev-server 配置

在`webpack.config.js`中，有一个`devServer`选项是用来配置`webpack-dev-server`，这里简单讲几个比较常用的配置。

##### port

我们可以通过 port 来设置服务器端口号。

```javascript
module.exports = {

  ...

  // 配置webpack-dev-server
  devServer: {
    port: 8888,  // 自定义端口号
  },
};
```

##### open

在`devServer`中有一个`open`选项，默认是为`false`，当你设置为`true`的时候，你每次运行`webpack-dev-server`就会自动帮你打开浏览器。

```javascript
module.exports = {

  ...

  // 配置webpack-dev-server
  devServer: {
    open: true,   // 自动打开浏览器窗口
  },
};
```

##### proxy

这个选项是用来设置本地开发的跨域代理的，关于跨域的知识就不多在这说了，这里就说说如何去配置。

`proxy`的值必须是一个对象，在里面我们可以配置一个或多个跨域代理。最简单的配置写法就是地址配上`api`地址。

```javascript
module.exports = {

  ...

  devServer: {
    // 跨域代理
    proxy: {
      '/api': 'http://localhost:3000'
    },
  },
};
```

这时候，当你请求`/api/users`的时候，就会代理到`http://localhost:3000/api/users`。

如果你不需要传递`/api`的话，你就需要使用对象的写法，从而增加一些配置选项：

```javascript
module.exports = {

  ...

  devServer: {
    // 跨域代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 代理地址
        pathRewrite: {'^/api': ''},   // 重写路径
      },
    },
  },
};
```

这时候，当你请求`/api/users`的时候，就会代理到`http://localhost:3000/users`。

在 proxy 中的选项，还有两个比较常用的，一个就是`changeOrigin`，默认情况下，代理时会保留主机头的来源，当我们将其设置为`true`可以覆盖这种行为；还有一个是`secure`选项，当你的接口使用了`https`的时候，需要将其设置为`false`。

```javascript
module.exports = {
  ...

  devServer: {
    // 跨域代理
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // 代理地址
        pathRewrite: {'^/api': ''},   // 重写路径
        secure: false,  // 使用https
        changeOrigin: true   // 覆盖主机源
      },
    },
  },
};
```

### CSS 处理

接下来讲讲关于`webpack`对`css`的解析处理叭。

#### 解析 CSS 文件

在前面的例子也能看到，我们解析`css`需要用到的`loader`有`css-loader`和`style-loader`。`css-loader`主要用来解析`css`文件，而`style-loader`是将`css`渲染到`DOM`节点上。

首先我们来安装一下：

```shell
 ## css-loader -> 6.2.0;  style-loader -> 3.2.1
 yarn add css-loader style-loader -D
```

然后我们新建一个`css`文件。

```css
/* style.css */
body {
  background: #222;
  color: #fff;
}
```

然后在`index.js`引入一下：

```javascript
import './style.css'
```

紧接着我们配置一下`webpack`：

```javascript
module.exports = {
   ...

  module: {
    rules: [
      {
        test: /\.css$/,  // 识别css文件
        use: ['style-loader', 'css-loader']  // 先使用css-loader,再使用style-loader
      }
    ]
  },

   ...
};
```

这时候我们打包一下，会发现`dist`路径下只有`main.js`和`index.html`。但打开一下`index.html`会发现`css`是生效的。

![demo1.png](/images/docs/webpack-study/demo1.png)

这是因为`style-loader`是将`css`代码插入到了`main.js`当中去了。

#### 打包 css 文件

如果我们不想将`css`代码放进`js`中，而是直接导出一份`css`文件的话，就得使用另一个插件——`mini-css-extract-plugin`。

```shell
## 2.1.0
yarn add mini-css-extract-plugin -D
```

然后将其引入到配置文件，并且在`plugins`引入。

```javascript
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  ...

  plugins: [
    // 使用miniCssExtractPlugin插件
    new miniCssExtractPlugin({
      filename: "[name].css"  // 设置导出css名称，[name]占位符对应chunkName
    })
  ]
};
```

紧接着，我们还需要更改一下`loader`，我们不再使用`style-loader`，而是使用`miniCssExtractPlugin`提供的`loader`。

```javascript
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.css$/,
        // 使用miniCssExtractPlugin.loader替换style-loader
        use: [miniCssExtractPlugin.loader,'css-loader']
      }
    ]
  },
  plugins: [
    new miniCssExtractPlugin({
        filename: "[name].css"
    })
  ]
};
```

接下来打包一下，`dist`路径下就会多出一个`main.css`文件，并且在`index.html`中也会自动引入。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script defer src="main.js"></script>
    <link href="main.css" rel="stylesheet" />
  </head>
  <body>
    HelloWorld！
  </body>
</html>
```

#### css 添加浏览器前缀

当我们使用一下`css`新特性的时候，可能需要考虑到浏览器兼容的问题，这时候可能需要对一些`css`属性添加浏览器前缀。而这类工作，其实可以交给`webpack`去实现。准确来说，是交给`postcss`去实现。

`postcss`对于`css`犹如`babel`对于`JavaScript`，它专注于对转换`css`，比如添加前缀兼容、压缩`css`代码等等。

首先我们需要先安装一下`postcss`和`post-css-loader`。

```shell
## postcss -> 8.3.6，postcss-loader -> 6.1.1
yarn add postcss postcss-loader -D
```

接下来，我们在`webpack`配置文件先引入`postcss-loader`，它的顺序是在`css-loader`之前执行的。

```javascript
rules: [
  {
    test: /\.css$/,
    // 引入postcss-loader
    use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
  },
]
```

接下来配置`postcss`的工作，就不在`webpack`的配置文件里面了。`postcss`自身也是有配置文件的，我们需要在项目根路径下新建一个`postcss,config.js`。然后里面也有一个配置项，为`plugins`。

```javascript
module.exports = {
  plugins: [],
}
```

这也意味着，`postcss`自身也支持很多第三方插件使用。

现在我们想实现的添加前缀的功能，需要安装的插件叫`autoprefixer`。

```shell
## 1.22.10
yarn add autoprefixer -D
```

然后我们只需要引入到`postcss`的配置文件中，并且它里面会有一个配置选项，叫`overrideBrowserslist`，是用来填写适用浏览器的版本。

```javascript
module.exports = {
  plugins: [
    // 将css编译为适应于多版本浏览器
    require('autoprefixer')({
      // 覆盖浏览器版本
      // last 2 versions: 兼容各个浏览器最新的两个版本
      // > 1%: 浏览器全球使用占有率大于1%
      overrideBrowserslist: ['last 2 versions', '> 1%'],
    }),
  ],
}
```

关于`overrideBrowserslist`的选项填写，我们可以去参考一下[browserslist](https://github.com/browserslist/browserslist)，这里就不多讲。

当然，我们其实可以在`package.json`中填写兼容浏览器信息，或者使用`browserslist`配置文件`.browserslistrc`来填写，这样子如果我们以后使用其他插件也需要考虑到兼容浏览器的时候，就可以统一用到，比如说`babel`。

```json
// package.json 文件
{
  ...
  "browserslist": ['last 2 versions', '> 1%']
}

```

```
## .browserslsetrc 文件
last 2 versions
> 1%
```

但如果你多个地方都配置的话，`overrideBrowserslist`的优先级是最高的。

接下来，我们修改一下`style.css`，使用一下比较新的特性。

```css
body {
  display: flex;
}
```

然后打包一下，看看打包出来后的`main.css`。

```css
body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

#### 压缩 css 代码

当我们需要压缩`css`代码的时候，可以使用`postcss`另一个插件——`cssnano`。

```shell
## 5.0.7
yarn add cssnano -D
```

然后还是在`postcss`配置文件中引入：

```javascript
module.exports = {
  plugins: [
    ... ,
    require('cssnano')
  ]
}
```

打包一下，看看`main.css`。

```css
body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
```

#### 解析 CSS 预处理器

在现在我们实际开发中，我们会更多使用`Sass`、`Less`或者`stylus`这类`css`预处理器。而其实`html`是无法直接解析这类文件的，因此我们需要使用对应的`loader`将其转换成`css`。

接下来，我就以`sass`为例，来讲一下如何使用`webpack`解析`sass`。

首先我们需要安装一下`sass`和`sass-loader`。

```shell
## sass -> 1.36.0, sass-loader -> 12.1.0
yarn add sass sass-loader -D
```

然后我们在`module`加上`sass`的匹配规则，`sass-loader`的执行顺序应该是排第一，我们需要先将其转换成`css`，然后才能执行后续的操作。

```javascript
rules: [
  ...{
    test: /\.(scss|sass)$/,
    use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
  },
]
```

然后我们在项目中新建一个`style.scss`。

```scss
$color-white: #fff;
$color-black: #222;

body {
  background: $color-black;

  div {
    color: $color-white;
  }
}
```

然后在`index.js`引入。

```javascript
import './style.css'
import './style.scss'
```

然后执行打包，再看看打包出来的`main.css`，`scss`文件内容被解析到里面，同时如果我们引入多个`css`或`css`预处理器文件的话，`miniCssExtractPlugin`也会将其打包成一个`bundle`文件里面。

```css
body {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
body {
  background: #222;
}
body div {
  color: #fff;
}
```

### 其他静态资源处理

当我们使用了图片、视频或字体等等其他静态资源的话，我们需要用到`url-loader`和`file-loader`。

```shell
## url-loader -> 4.1.1; file-loader -> 6.2.0
yarn add url-loader file-loader -D
```

首先我们在项目中引入一张图片，然后在引入到`index.js`中。

```javascript
import pic from './image.png'

const img = new Image()
img.src = pic
document.querySelector('body').append(img)
```

然后我先使用`url-loader`。

```javascript
module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.(png|je?pg|gif|webp)$/,
        use: ['url-loader']
      }
    ]
  }
};
```

然后执行一下打包。

你会发现，`dist`路径下没有图片文件，但是你打开页面是可以看到图片的，且通过调试工具，我们可以看到其实`url-loader`默认会将静态资源转成`base64`。

![demo2.png](/images/docs/webpack-study/demo2.png)

当然，`url-loader`选项有提供一个属性，叫`limit`，就是我们可以设置一个文件大小阈值，当文件大小超过这个值的时候，`url-loader`就不会转成`base64`，而是直接打包成文件。

```javascript
module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.(png|je?pg|gif|webp)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',   // 使用占位符设置导出名称
            limit: 1024 * 10  // 设置转成base64阈值，大于10k不转成base64
          }
        }]
      }
    ]
  }
};
```

这时候我们再打包一下，`dist`文件夹下就会出现了图片文件。

而`file-loader`其实跟`url-loader`差不多，但它默认就是导出文件，而不会导出`base64`的。

```javascript
module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.(png|je?pg|gif|webp)$/,
        use: ['file-loader']
      }
    ]
  }
};
```

打包一下，会发现`dist`文件夹下依旧会打包成一个图片文件，但是它的名称会被改成哈希值，我们可以通过`options`选项来设置导出的名称。

```javascript
module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.(png|je?pg|gif|webp)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',   // 使用占位符设置导出名称
          }
        }]
      }
    ]
  }
};
```

而对于视频文件、字体文件，也是用相同的方法，只不过是修改`test`。

```javascript
module.exports = {
  ...
  module: {
    rules: [
      // 图片
      {
        test: /\.(png|je?pg|gif|webp)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            name: '[name].[ext]',
            limit: 1024 * 10
          }
        }
      },
      // 字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 1024 * 10
          }
        }
      },
      // 媒体文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 1024 * 10
          }
        }
      }
    ]
  }
};
```

但现在有个问题，就是如果直接在`index.html`引入图片的话，可以顺利打包吗？

答案是不会的，我们可以测试一下。首先将图片引入`index.html`。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <img src="./image.png" />
  </body>
</html>
```

然后执行打包后，打包出来的`index.html`照样是`<img src="./image.png">`，但是我们并没有解析和打包出来`image.png`出来。

这时候我们需要借助另一个插件——`html-withimg-loader`。

```shell
## 0.1.16
yarn add html-withimg-loader -D
```

然后我们再添加一条`rules`。

```javascript
{ test: /\.html$/,loader: 'html-withimg-loader' }
```

这时候打包成功后，`dist`文件成功将图片打包出来了，但是打开页面的时候，图片还是展示不出来。然后通过调试工具看的话，会发现

```html
<img src="{"default":"image.png"}">
```

这是因为`html-loader`使用的是`commonjs`进行解析的，而`url-loader`默认是使用`esmodule`解析的。因此我们需要设置一下`url-loader`。

```javascript
{
  test: /\.(png|je?pg|gif|webp)$/,
    use: {
      loader: 'url-loader',
        options: {
          esModule: false,  // 不适用esmodule解析
          name: '[name].[ext]',
          limit: 1024 * 10
        }
    }
}
```

这时候重新打包一下，页面就能成功展示图片了。

#### Webpack5 资源模块

> https://webpack.docschina.org/guides/asset-modules/

在`webpack5`中，新添了一个资源模块，它允许使用资源文件（字体，图标等）而无需配置额外 `loader`，具体的内容大家可以看看文档，这里简单讲一下如何操作。

前面的例子，我们对静态资源都使用了`url-loader`或者`file-loader`，而在`webpack5`，我们甚至可以需要手动去安装和使用这两个`loader`，而直接设置一个`type`属性。

```javascript
{
  test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
  type: "asset/resource",
}
```

然后打包测试后，静态文件都会直接打包成文件并自动引入，效果跟`file-loader`一致。

`type`值提供了四个选项：

- **`asset/resource`：** 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
- **`asset/inline` ：** 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
- **`asset/source ` ：**导出资源的源代码。之前通过使用 `raw-loader` 实现。
- **`asset`：** 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

同时，我们可以在`output`设置输出`bundle`静态文件的名称：

```javascript
output: {
  path: path.resolve(__dirname, 'dist/'),
  filename: '[name].js',
  // 设置静态bundle文件的名称
  assetModuleFilename: '[name][ext]'
}
```

### JavaScript 转义

不仅仅`css`需要转义，`JavaScript`也要为了兼容多浏览器进行转义，因此我们需要用到`babel`。

```shell
## 8.2.2
yarn add babel-loader -D
```

同时，我们需要使用`babel`中用于`JavaScript`兼容的插件：

```shell
## @babel/preset-env -> 7.14.9; @babel/core -> 7.14.8; @core-js -> 3.16.0
yarn add @babel/preset-env @babel/core core-js -D
```

接下来，我们需要配置一下`webpack`的配置文件。

```javascript
{
  test: /\.js$/,
  use: ['babel-loader']
}
```

然后我们需要配置一下`babel`。当然我们可以直接在`webpack.config.js`里面配置，但是`babel`同样也提供了配置文件`.babelrc`，因此我们就直接在这边进行配置。

在根路径新建一个`.babelrc`。

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        // 浏览器版本
        "targets": {
          "edge": "17",
          "chrome": "67"
        },
        // 配置corejs版本，但需要额外安装corejs
        "corejs": 3,
        // 加载情况
        // entry: 需要在入口文件进入@babel/polyfill，然后babel根据使用情况按需载入
        // usage: 无需引入，自动按需加载
        // false: 入口文件引入，全部载入
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```

接下来，我们来测试一下，先修改一下`index.js`。

```javascript
new Promise((resolve) => {
  resolve('HelloWorld')
}).then((res) => {
  console.log(res)
})
```

然后执行`yarn build`进行打包。

在使用`babel`之前，打包出来的`main.js`如下。

```javascript
!(function () {
  'use strict'
  new Promise((o) => {
    o('HelloWorld')
  }).then((o) => {
    console.log(o)
  })
})()
```

上面打包代码是直接使用了`Promise`，而没有考虑到低版本浏览器的兼容。然后我们打开`babel`后，执行一下打包命令，会发现代码多出了很多。

而在打包代码中，可以看到`webpack`使用了`polyfill`实现`promise`类，然后再去调用，从而兼容了低版本浏览器没有`promise`属性问题。

### 文件归类

在目前我们的测试代码中，我们的`src`文件夹如下：

```
├── src
│   ├── Alata-Regular.ttf
│   ├── image.png
│   ├── index.html
│   ├── index.js
│   ├── style.css
│   └── style.scss
```

而正常项目的话，我们会使用文件夹将其分好类，这并不难，我们先简单归类一下。

```
├── src
│   ├── index.html
│   ├── js
│   │   └── index.js
│   ├── static
│   │   └── image.png
│   │   └── Alata-Regular.ttf
│   └── style
│       ├── style.css
│       └── style.scss

```

接下来，我们需要打包出来的文件也是归类好的，这里就不太复杂，直接用一个`assets`文件夹将所有静态文件放进去，然后`index.html`放外面。

```
├── dist
│   ├── assets
│   │   ├── Alata-Regular.ttf
│   │   ├── image.png
│   │   ├── main.css
│   │   └── main.js
│   └── index.html
```

这里先补充一下`style.css`引入字体的代码：

```css
@font-face {
  font-family: 'test-font';
  src: url('../static/Alata-Regular.ttf') format('truetype');
}

body {
  display: flex;
  font-family: 'test-font';
}
```

首先，我们先将打包出来的`JavaScript`文件放入`assets`文件夹下，我们只需要修改`output.filename`即可。

```javascript
output: {
  path: path.resolve(__dirname, 'dist/'),
  filename: 'assets/[name].js'
}
```

其次，我们将打包出来的`css`文件也放入`assets`路径下，因为我们打包`css`是使用`miniCssExtractPlugin`，因此我们只需要配置一下`miniCssExtractPlugin`的`filename`即可：

```javascript
plugins: [
  ...new miniCssExtractPlugin({
    filename: 'assets/[name].css',
  }),
]
```

最后就是静态资源了，这里我们使用静态模块方案，所以直接修改`output.assetModuleFilename`即可：

```javascript
output: {
  path: path.resolve(__dirname, 'dist/'),
  filename: 'assets/[name].js',
  assetModuleFilename: 'assets/[name][ext]'
},
```

这时候打包一下，预览一下页面，发现都正常引入和使用。

### 哈希值

通常，我们打包文件的文件名都需要带上一个哈希值，这会给我们的好处就是避免缓存。

`webpack`也提供了三种哈希值的策略，接下来我们一一来看看：

#### 前期准备

为了更好的比较三者之间的区别，这边先调整一下项目和配置。

```javascript
// index.js
import pic from "../static/image.png";

const img = new Image();
img.src = pic;
document.querySelector('body').append(img);

// main.js
import "../style/style.scss";
import "../style/style.css";

console.log('Hello World')


// webpack.config.js
entry: {
  index: './src/js/index.js',
  main: './src/js/main.js'
},
```

#### hash 策略

`hash`策略，是以项目为单位的，也就是说，只要项目一个文件发生改动，首先打包后该文件对应的`bundle`文件名会改变，其次所有`js`文件和`css`文件的文件名也会改变。

我们先通过一个例子来看看：

首先我们需要在所有设置`filename`的地方加入`[hash]`占位符，同时我们也可以设置哈希值的长度，只需加上冒号和长度值即可，比如`[hash:6]`。

```javascript
module.exports = {
  entry: {
    index: './src/js/index.js',
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'assets/[name]-[hash:6].js',
    assetModuleFilename: 'assets/[name]-[hash:6][ext]'
  },
  module: {
    ...
  },
  plugins: [
    ...
    new miniCssExtractPlugin({
      filename: "assets/[name]-[hash:6].css"
    }),
  ]
};
```

这时候打包一下，看看打包文件：

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-7503bc.png
│   ├── index-7fa71a.js
│   ├── main-7fa71a.css
│   └── main-7fa71a.js
└── index.html
```

然后我随便改一下`style.css`，再重新打包一下。

这时候会发现`index.js`、`main.js`、`main.css`的文件名都会发生改变，但静态文件并不会发生变化。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-7503bc.png
│   ├── index-4b2329.js
│   ├── main-4b2329.css
│   └── main-4b2329.js
└── index.html
```

然后我们重新找一张图片，覆盖一下`image.png`，然后重新打包。

这时候，`index.js`、`main.js`、`main.css`的文件名依旧会发生改变，同时`image.png`也发生了变化。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-f3f2ec.png
│   ├── index-46acaa.js
│   ├── main-46acaa.css
│   └── main-46acaa.js
└── index.html
```

通过上面的例子，我们可以简单总结出：

- 如果修改项目文件的话，所有的`js`、`css`打包文件的文件名都会发生变化，尽管来自多个`chunk`。
- 如果修改静态文件的话，该静态文件的打包文件文件名会发生变化，并且所有的`js`、`css`打包文件的文件名也都会发生变化。

#### chunkhash 策略

而`chunkhash`策略的话，是以`chunk`为单位的，如果一个文件发生变化，只有那条`chunk`相关的文件的打包文件文件名才会发生变化。

我们依旧通过例子看看：

首先我们先将配置文件都改成`chunkhash`。这里注意的是`chunkhash`不适用于静态文件，因此静态文件依旧使用`hash`。

```javascript
module.exports = {
  entry: {
    index: './src/js/index.js',
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'assets/[name]-[chunkhash:6].js',
    assetModuleFilename: 'assets/[name]-[hash:6][ext]'
  },
  module: {
    ...
  },
  plugins: [
    ...
    new miniCssExtractPlugin({
      filename: "assets/[name]-[chunkhash:6].css"
    }),
  ]
};
```

先打包一次：

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-f3f2ec.png
│   ├── index-6be98e.js
│   ├── main-a15a74.css
│   └── main-a15a74.js
└── index.html
```

然后我们首先修改一下`style.css`，打包一下，会发现`main.css`和`main.js`都发生了变化，而`index.js`不是一个`chunk`的，因此不会发生变化。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-f3f2ec.png
│   ├── index-6be98e.js
│   ├── main-88f8ea.css
│   └── main-88f8ea.js
└── index.html
```

同样，我们再覆盖一下`image.png`，再打包一下。

这时候`image.png`固然会发生变化，然后`index.js`也发生了变化，因为它们是一个`chunk`的，而`main.css`和`main.js`就不会发生变化。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-7503bc.png
│   ├── index-89dfd4.js
│   ├── main-88f8ea.css
│   └── main-88f8ea.js
└── index.html
```

简单总结一下：

- 如果修改项目文件的话，该项目文件对应的`chunk`的`js`、`css`打包文件的文件名都会发生变化。
- 如果修改静态文件的话，该静态文件的打包文件文件名会发生变化，并且引入该静态文件对应的`chunk`的`js`、`css`打包文件的文件名也都会发生变化。

#### contenthash 策略

最后一个就是`contenthash`策略， 它是以自身内容为单位的，因此当一个文件发生变化的时候，首先它本身的打包文件的名称会发生变化，其次，引入它的文件的打包文件也会发生变化。

惯例来个实验：

我们将所以哈希占位符改成`contenthash`。

```javascript
module.exports = {
  entry: {
    index: './src/js/index.js',
    main: './src/js/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: 'assets/[name]-[contenthash:6].js',
    assetModuleFilename: 'assets/[name]-[contenthash:6][ext]'
  },
  module: {
    ...
  },
  plugins: [
    ...
    new miniCssExtractPlugin({
      filename: "assets/[name]-[contenthash:6].css"
    }),
  ]
};
```

然后先打包一下。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-7503bc.png
│   ├── index-1e2b37.js
│   ├── main-02a4b4.css
│   └── main-c437b0.js
└── index.html
```

首先我们先修改一下图片吧，找一张新图覆盖一下`image.png`，然后打包一下。

首先`image.png`的名称一定会发生变化，因为它改动了。其次`index.js`也会发生变化，这是因为它引入了`image.png`，而`image.png`的名称发生变化，因此它代码中引入的名称也得发生变化，因此`index.js`的名称也会发生变化。

而`main.js`和`main.css`因为没有引用`image.png`，因此不会发生变化。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-f3f2ec.png
│   ├── index-e241d6.js
│   ├── main-02a4b4.css
│   └── main-c437b0.js
└── index.html
```

接下来，我们来修改一下`main.js`，然后打包一下。

我们会发现，只有`main.js`的打包文件会发生变化，而处于同个`chunk`的`main.css`却不会发生变化，这是因为`main.css`没有引用`main.js`。

```
├── assets
│   ├── Alata-Regular-e83420.ttf
│   ├── image-f3f2ec.png
│   ├── index-e241d6.js
│   ├── main-02a4b4.css
│   └── main-d1f8ed.js
└── index.html
```

现在可以简单总结一下：

- 不管是修改项目文件还是静态文件，它本身的打包文件的文件名会发生变化，其次引用该文件的对应打包文件的文件名也会发生变化，向上递归。

### 多个打包配置

通常我们项目都会有开发环境和生产环境。

前面我们也看到了`webpack`提供了一个`mode`选项，但我们开发中不太可能说开发的时候`mode`设置为`development`，然后等到要打包才设置为`production`。当然，前面我们也说了，我们可以通过命令`--mode`来对应匹配`mode`选项。

但如果开发环境和生产环境的`webpack`配置差异不仅仅只有`mode`选项的话，我们可能需要考虑多份打包配置了。

#### 多个 webpack 配置文件

我们默认的`webpack`配置文件名为`webpack.config.js`，而`webpack`执行的时候，也默认会找该配置文件。

但如果我们不使用该文件名，而改成`webpack.conf.js`的话，`webpack`正常执行是会使用默认配置的，因此我们需要使用一个`--config`选项，来指定配置文件。

```shell
webpack --config webpack.conf.js
```

因此，我们就可以分别配置一个开发环境的配置`webpack.dev.js`和生成环境的配置`webpack.prod.js`，然后通过指令进行执行不同配置文件：

```json
// package.json
 "scripts": {
   "dev": "webpack --config webpack.dev.js",
   "build": "webpack --config webpack.prod.js",
 }
```

#### 单个配置文件

如果说，你不想创建那么多配置文件的话，我们也可以只只用`webpack.config.js`来实现多份打包配置。

按照前面说的使用`--mode`配置`mode`选项，其实我们可以在`webpack.config.js`中拿到这个变量，因此我们就可以通过这个变量去返回不同的配置文件。

```javascript
// argv.mode可以获取到配置的mode选项
module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // 返回开发环境的配置选项
    return { ... }
  }else if (argv.mode === 'production') {
    // 返回生产环境的配置选项
    return { ... }
  }
};
```

## 优化一下 Webpack 配置

### 合理的配置`mode`选项和`devtool`选项

前面已经有讲到关于`mode`选项和`devtool`选项，而不同选项打包的速度也会有所不同，因此按照你的实际需求进行配置，有需要用到才生成，没需要用到就能省就省。

### 缩小文件搜索范围

#### alias 选项

在配置文件中，其实有一个`resovle.alias`选项，它可以创建`import`和`reuquire`别名，来确保模块引入变得更简单，同时`webpack`在打包的时候也能更快的找到引入文件。

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  ...

  resolve: {
    alias: {
      // 配置style路径的别名
      style: path.resolve(__dirname, 'src/style/')
    },
  }
};
```

```javascript
// 使用
import 'style/style.scss'
import 'style/style.css'
```

#### include、exclude 选项

当我们使用`loader`的时候，我们可以配置`include`来指定只解析该路径下的对应文件，同时我们可以配置`exclude`来指定不解析该路径下的对应文件。

```javascript
const path = require('path');

module.exports = {
  ...

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        include: [path.resolve(__dirname, 'src')]  // 只解析src路径下的css
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/   // 不解析node_modules路径下的js
      }
  ]
}
};
```

#### noParse 选项

我们可以在`module.noParse`选项中，只配置不需要解析的文件。通常我们会忽略一些大型插件从而来提高构建性能。

```javascript
module.exports = {
  ...
  module: {
    noParse: /jquery|lodash/,
  },
};
```

### 使用 HappyPack 开启多进程 Loader

在`webpack`构建过程中，其实大部分消耗时间都是用到`loader`解析上面，一方面是因为转换文件数据量很大，另一方面是因为`JavaScript`单线程特性的原因，因此需要一个个去处理，而不能并发操作。

而我们可以使用`HappyPack`，将这部分任务分解到多个子进程中去进行并行处理，子进程处理完成后把结果发送到主进程中去，从而减少总的构建时间。

> https://github.com/amireh/happypack

```shell
## 5.0.1
yarn add happypack -D
```

```javascript
// webpack.config.js
const HappyPack = require("happypack");
const os = require("os");
const HappyThreadPool = HappyPack.ThreadPool({size: os.cpus().length});

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: 'happypack/loader?id=happyBabelLoader'
        }]
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happyBabelLoader',  // 与loader对应的id标识
      // 用法跟loader配置一样
      loaders: [
        {loader: 'babel-loader', options: {}}
      ],
      threadPool: HappyThreadPool  // 共享进程池
    })
  ]
};
```

### 使用 webpack-parallel-uglify-plugin 增强代码压缩

起码有聊到，当`mode`为`production`的时候，`webpack`打包会开启代码压缩插件，同时`webpack`也有提供一个`optimization`选项，让我们可以使用自己喜欢的插件去覆盖原生插件。

因此，我们可以使用`webpack-parallel-uglify-plugin`来覆盖原生代码压缩插件，它的一个优点就是可以并行执行。

> https://github.com/gdborton/webpack-parallel-uglify-plugin#readme

```shell
## 2.0.0
yarn add webpack-parallel-uglify-plugin -D
```

```javascript
// webpack.config.js
const ParallelUglifyPlugin = require("webpack-parallel-uglify-plugin")

module.exports = {
  ...

  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({
        // 缓存路径
        cacheDir: '.cache/',
        // 压缩配置
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      })
    ]
  }
};
```

### 配置缓存

我们每次执行构建都会把所有的文件都重新编译一边，如果我们可以将这些重复动作缓存下来的话，对下一步的构建速度会有很大的帮助。

现在大部分的`loader`都提供了缓存选项，但并非所有的`loader`都有，因此我们最好自己去配置一下全局的缓存动作。

在`Webpack5`之前，我们都使用了`cache-loader`，而在`webpack5`中，官方提供了一个`cache`选项给我们带来持久性缓存。

```javascript
// 开发环境
module.exports = {
  cache: {
    type: 'memory', // 默认配置
  },
}

// 生产环境
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
}
```

### 分析打包文件大小

我们可以使用`webpack-bundle-analyzer`插件来帮助我们分析打包文件，它会将打包后的内容束展示为方便交互的直观树状图，让我们知道我们所构建包中真正引入的内容。

> https://github.com/webpack-contrib/webpack-bundle-analyzer

```shell
## 4.4.2
yarn add webpack-bundle-analyzer -D
```

```javascript
// webpack.config.js
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
  ...

  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

然后我们打包后，`webpack`会自动打开一个页面，显示我们打包文件的情况，通过打包报告可以很直观的知道哪些依赖包大，则可以做做针对性的修改。

![demo3.png](/images/docs/webpack-study/demo3.png)

如果不想每次运行都打开网页的话，我们可以先将数据保存起来，然后要看的时候再执行新的命令去查看。

```javascript
// webpack.config.js
new BundleAnalyzerPlugin({
  analyzerMode: 'disabled',
  generateStatsFile: true,
})
```

```json
// package.json
"scripts": {
  "analyzer": "webpack-bundle-analyzer --port 3000 ./dist/stats.json"
},
```

## 手写一下

### 手写 Loader

> https://webpack.js.org/contribute/writing-a-loader/#common-code

在`webpack`官网，它给提出了几个`loader`的编写原则：

- **单一原则：**每个`loader`只做一件事情；
- **链式调用：**`webpack`会按照顺序链式去调用每个`loader`；
- **统一原则：**遵循`webpack`定制的设计规则和结构，输入和输入均为字符串，每个`loader`完全独立，即插即用。

同时`webpack`还给我们提供了[`loader API`](https://webpack.docschina.org/api/loaders/)，因此我们可以使用`this`去获取需要用到的`API`，但也是因为如此，我们`loader`的实现就**不能使用箭头函数**了。

今天，我们来简单手写一下`sass-loader`、`css-loader`和`style-loader`，而它们也有各自的单一功能：

- `sass-loader`：用来解析`sass`和`scss`代码；
- `css-loader`：用来解析`css`代码；
- `style-loader`：将`css`代码插入到`js`中。

首先，我们先创建一个`myLoders`文件夹，然后创建三个`loader`文件。

```
├── myLoaders
│   ├── ou-css-loader.js
│   ├── ou-sass-loader.js
│   └── ou-style-loader.js
```

然后我们需要在`webpack`引入，并且需要配置一下`resolveLoader`选项，因为`webpack`默认只会去`node_modules`搜索`loader`。

```javascript
module.exports = {
  ...

  resolveLoader: {
    // 添加loader查询路径
    modules: ['node_modules', './myLoaders']
  },
  module: {
    rules: [{
      test: /\.(scss|sass)$/,
      // 使用自己的loader
      use: ['ou-style-loader','ou-css-loader','ou-sass-loader']
    }]
  }
};
```

首先我们先来实现`ou-sass-loader`。

`loader`的本质就是一个函数，而我们可以在函数的第一个参数获取到对应文件的代码，我们可以先打印一下来看看。

```javascript
// ou-sass-loader.js
module.exports = function (source) {
  console.log(source)
}
```

然后执行打包后，我们可以看到我们的`scss`文件中的代码。

因此，我们可以使用`sass`插件来进行解析`scss`代码，`sass`有一个`render`函数可以去解析。

```javascript
// ou-sass-loader.js
const sass = require('sass')

module.exports = function (source) {
  // 使用render函数进行解析scss代码
  sass.render({ data: source }, (err, result) => {
    console.log(result)
  })
}
```

我们在执行一下打包，会发现`result`是一个对象，而里面的`css`就是我们所需要的，因此我们需要将其返回出去。

> 这里`css`是`Buffer`，我们需要去解析它，但是解析它是`css-loader`的工作，而不是`sass-loader`的工作。

```json
{
  css: <Buffer 62 6f 64 79 20 7b 0a 20 20 62 61 63 6b 67 72 6f 75 6e 64 3a 20 23 32 32 32 3b 0a 7d 0a 62 6f 64 79 20 64 69 76 20 7b 0a 20 20 63 6f 6c 6f 72 3a 20 23 ... 6 more bytes>,
  map: null,
  stats: {
    entry: 'data',
    start: 1628131813793,
    end: 1628131813830,
    duration: 37,
    includedFiles: [ [Symbol($ti)]: [Rti] ]
  }
}
```

但这里是一个异步操作，我们不能直接`return`回去，而是需要使用到`webpack`提供的一个`API`——`this.async`，它本身是一个函数，然后会返回一个`callback()`让我们可以返回异步的结果。

```javascript
// ou-sass-loader.js
const sass = require('sass')

module.exports = function (source) {
  // 获取callback函数
  const callback = this.async()
  sass.render({ data: source }, (err, result) => {
    // 将结果返回
    if (err) return callback(err)
    callback(null, result.css)
  })
}
```

这时候，我们`ou-sass-loader`就实现了，接下来我们来实现`ou-css-loader`。

它其实任务很简单，就是将`ou-sass-loader`返回的`css`解析为字符串就可以了。

```javascript
// ou-css-loader.js
module.exports = function (source) {
  return JSON.stringify(source)
}
```

最后就是`ou-style-loader`，它的任务就是创建一个`style`标签，然后将`ou-css-loader`返回的数据插进去，并且将`style`标签放置到`head`标签里面去。

```javascript
// ou-style-loader.js
module.exports = function (sources) {
  return `
    const tag = document.createElement("style");
    tag.innerHTML = ${sources};
    document.head.appendChild(tag)
  `
}
```

这时我们简易版的`sass-loader`、`css-laoder`和`style-laoder`就实现了，我们可以执行一下打包命令，检验页面是不是有对应的样式效果。

### 手写 Plugin

> https://webpack.js.org/contribute/writing-a-plugin/

在`webpack`运行过程中，会存在一个生命周期，而在生命周期中`webpack`会广播出许多事情，而在`plugin`中是可以监听到这些事件，因此`plugin`是可以实现在合适的时机通过`Webpack`提供的`API`去实现一些动作。

正常情况下，一个`plugin`是一个类，并且里面会有一个`apply`函数，而在`apply`函数中会接收到一个`compiler`参数，里面包含了关于`webpack`环境所有的配置信息。

```javascript
module.exports = class MyPlugin {
  apply(compiler) {}
}
```

在`compiler`中会暴露很多生命周期钩子函数，具体的可以查看[文档](https://www.webpackjs.com/api/compiler-hooks/)。我们可以通过以下方式去访问钩子函数。

```javascript
compiler.hooks.someHook.tap(...)
```

在`tap`方法中，接收两个参数，一个是该`plugin`的名称，一个是回调函数，而在回调函数中，又会接收到一个`compilation`参数。

```javascript
module.exports = class MyPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap('MyPlugin', (compilation) => {
      console.log(compilation)
    })
  }
}
```

`compilation`对象包含了当前的模块资源、编译生成资源、变化的文件等。当运行`webpack` 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 `compilation`，从而生成一组新的编译资源。`compilation` 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。

`compliation`也暴露了许多的钩子，具体的话可以去看看[文档](https://www.webpackjs.com/api/compilation-hooks/)。

接下来，简单实现一下一个`plugin`，打包后生成一个`txt`文件，里面会打印出每个`bundle`的大小。

```javascript
module.exports = class MyPlugin {
  apply(compiler) {
    // 生成资源到 output 目录之前
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      let str = ''
      for (let filename in compilation.assets) {
        // 获取文件名称和文件大小
        str += `${filename} -> ${compilation.assets[filename]['size']() / 1000}KB\n`
      }

      // 新建fileSize.txt
      compilation.assets['fileSize.txt'] = {
        // 内容
        source: function () {
          return str
        },
      }
    })
  }
}
```

紧接着，我们将其引入到`webpack.config.js`，并在`plugins`中创建实例。

```javascript
const MyPlugin = require("./myPlugins/my-plugin")

module.exports = {
  ...

  plugins: [
    new MyPlugin()
  ]
};
```

然后打包后，`dist`文件中会生成一个`fileSize.txt`文件。

```
assets/Alata-Regular-e83420.ttf -> 96.208KB
assets/image-f3f2ec.png -> 207.392KB
index.html -> 0.364KB
assets/index-41f0e2.css -> 0.177KB
assets/index-acc2f5.js -> 1.298KB
```

### 手写 Webpack

> 代码：https://github.com/ouduidui/mini-webpack
>
> 喜欢的朋友可以点个`Star`哦~

#### 初始化

首先我们先初始化我们的项目文件。

先新建一个`src`路径，然后创建三个`js`文件——`index.js`、`a.js`、`b.js`。

```javascript
// index.js
import { msg } from './a.js'

console.log(msg)

// a.js
import { something } from './b.js'

export const msg = `Hello ${something}`

// b.js
export const something = 'World'
```

然后我们可以先安装`webpack`，然后测试一下打包出来的`bundle`文件有什么特点。

> 这里就不多说了，直接看`bundle`文件（默认配置，`mode`为`development`）

打包后，我们可以看到`bundle`文件有很多内容，但也有一大半注释。

其实我们只需要看两个地方，一个是`__webpack_modules__`变量。我们可以看到它是一个对象，然后`key`值为`module`路径，而`value`值是执行`module`代码的函数。

```javascript
var __webpack_modules__ = ({
  "./src/a.js": (() => eval( ... )),
  "./src/b.js": (() => eval( ... )),
  "./src/index.js": (() => eval( ... ))
})
```

其次，我们能看到一个函数，叫`__webpack_require__`，它接收一个`moduleId`的参数。然而我们可以在最后看到了这个函数的调用，就会发现其实`moduleId`就是`__webpack_modules__`的`key`值，也就是`module`的路径。

```javascript
var __webpack_exports__ = __webpack_require__('./src/index.js')
```

到这里，我们就可以大概捋清楚`webpack`打包的一个逻辑了。

- `webpack`是直接拿到`js`文件的代码，即字符串。然后通过`eval()`函数执行代码；
- `webpack`会从入口文件开始，不断递归遍历引入模块，然后保持在一个对象里面，`key`值为`moduleId`，即模块路径，而`value`是模块的相关代码。
- `webpack`会将代码转换为`commonJS`，即使用`require`去引入模块，同时它自身会去封装一个`require`函数，去执行入口文件代码。

话不多说，我们开始来手写代码。

首先我们可以先初始化`webpack`配置文件——`webpack.config.js`。

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
  },
}
```

其次，我们新建一个`lib`文件夹，然后创建一个`webpack.js`，用来手写我们的`mini-webpack`。

我们可以先初始化一下，`Webpack`是一个类，其次构建函数会接受配置文件，其次会有一个`run`函数，是`webpack`的运行函数。

```javascript
module.exports = class Webpack {
  /**
   *  构造函数，获取webpack配置
   *  @param {*} options
   */
  constructor(options) {}

  /**
   *  webpack运行函数
   */
  run() {
    console.log('开始执行Webpack!')
  }
}
```

然后我们需要一个执行文件，即在根路径创建一个`debugger.js`。

```javascript
const webpack = require('./lib/webpack')
const options = require('./webpack.config')

new webpack(options).run()
```

紧接着我们执行一下该文件。

```shell
node debugger.js
```

这时候命令行就会打印出`开始执行Webpack!`。

我们可以开始手写`mini-webpack`了。

#### 模块解析

首先，在构造函数中，我们需要保存一下配置信息。

```javascript
constructor(options) {
  const {entry, output} = options;
  this.entry = entry;  // 入口文件
  this.output = output;  // 导出配置
}
```

在执行的第一步，我们需要来解析一下入口文件，因此我们用一个`parseModules`来实现这个功能。

```javascript
module.exports = class Webpack {
    constructor(options) {
        ...
    }

    run() {
        // 解析模块
        this.parseModules(this.entry);
    }

    /**
     *  模块解析
     *  @param {*} file
     */
    parseModules(file) {}
}
```

在`parseModules`中，我们需要做两件事情：分析模块信息、递归遍历引入模块。

我们一步一步来实现。首先，封装一个`getModuleInfo`函数，来分析模块信息。

```javascript
parseModules(file) {
  // 分析模块
  this.getModuleInfo(file);
}

 /**
 *  分析模块
 *  @param {*} file
 *  @returns Object
 */
getModuleInfo(file) {}
```

首先，我们接收到的`file`其实就是入口文件的相对路径，即`./src/index.js`。因此我们可以先用`node`自带的`fs`模块来读取文件内容。

```javascript
getModuleInfo(file) {
  // 读取文件
  const body = fs.readFileSync(file, "utf-8");
}
```

读取到内容后，我们就要来分析一下文件内容了，这时候就需要用到了`AST语法树`了。

> 抽象语法树 (`Abstract Syntax Tree`)，简称 `AST`，它是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。
>
> 演示地址：https://astexplorer.net/

这里我们用到的时候`babel`的`parse`插件，通过它来将`JavaScript`转成`AST`。

```shell
## 7.14.8
yarn add @babel/parser -D
```

```javascript
const fs = require("fs");
const parser = require("@babel/parser");

module.exports = class Webpack {
    ...

    getModuleInfo(file) {
      // 读取文件
      const body = fs.readFileSync(file, "utf-8");

      // 转化为AST语法树
      const ast = parser.parse(body, {
        sourceType: 'module'  // 表示我们解析的是ES模块
      })
    }
}
```

紧接着，我们还需要使用`@babel/traverse`来遍历`AST`，从而来识别该文件有没有引入其他模块，有的话就将其记录下来。

```shell
## 7.14.8
yarn add @babel/traverse -D
```

```javascript
const traverse = require('@babel/traverse').default
```

`traverse`接受两个参数，第一个是`ast`语法树，第二个是一个对象，在对象中我们可以设置观察者函数，并且可以针对语法树中的特定节点类型。

比如我们这次只需要找到引入模块的语句，对应的节点类型为`ImportDeclaration`，我们就可以设置对应的`ImportDeclaration`函数，并在参数值获取到节点信息。

```javascript
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;


module.exports = class Webpack {
    ...

    getModuleInfo(file) {
      // 读取文件
      const body = fs.readFileSync(file, "utf-8");

      // 转化为AST语法树
      const ast = parser.parse(body, {
        sourceType: 'module'  // 表示我们解析的是ES模块
      })

      traverse(ast, {
        // visitor函数
        ImportDeclaration({node}) {
          console.log(node);
        }
      })
    }
}
```

我们执行一下，可以打印出`import {msg} from "./a.js"`的语法树。

因此，我们需要将其路径收集起来。

```javascript
// 依赖收集
const deps = {}
traverse(ast, {
  // visitor函数
  ImportDeclaration({ node }) {
    // 入口文件路径
    const dirname = path.dirname(file)
    // 引入文件路径
    const absPath = './' + path.join(dirname, node.source.value)
    deps[node.source.value] = absPath
  },
})
```

此时的`deps`就是`{ './a.js': './src/a.js' }`，之所以要保存它相对项目根路径的相对路径，是为了后面更好的去拿到它的文件内容。

收集完依赖后，我们需要将`AST`转回`JavaScript`代码，并且将其转成`ES5`语法。这时候我们就会用到`@babel/core`和`@babel/preset-env`。

```shell
## @babel/core -> 7.14.8, @babel/preset-env -> 7.14.8
yarn add @babel/core @babel/preset-env -D
```

```javascript
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

module.exports = class Webpack {
    ...

    getModuleInfo(file) {
      // 读取文件
      const body = fs.readFileSync(file, "utf-8");

      // 转化为AST语法树
      const ast = parser.parse(body, {
        sourceType: 'module'  // 表示我们解析的是ES模块
      })

      // 依赖收集
      const deps = {};
      traverse(ast, {
        // visitor函数
        ImportDeclaration({node}) {
          // 入口文件路径
          const dirname = path.dirname(file);
          // 引入文件路径
          const absPath = "./" + path.join(dirname, node.source.value);
          deps[node.source.value] = absPath;
        }
      })

      // ES6转成ES5
      const {code} = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"],
      })
    }
}
```

这时候我们可以打印一下`code`，会发现它不再是`ESModule`的引入方式了，而是使用了`CommonJS`引入方式。

```javascript
'use strict'

var _a = require('./a.js')

console.log(_a.msg)
```

最终，`getModuleInfo`会返回一个对象，对象里面包含着解析文件的路径，该文件的依赖对象以及文件代码。

```javascript
parseModules(file) {
  // 分析模块
  const entry = this.getModuleInfo(file);
}

getModuleInfo(file) {
  ...

  return {
    file,   // 文件路径
    deps,  // 依赖对象
    code   // 代码
  };
}
```

但我们分析完入口文件后，我们就需要进行递归遍历，去分析引入模块。

首先，我们需要新建一个数组，保存一下所有的分析结果。其次，我们来实现一下`getDeps`函数，来递归遍历引入模块。

```javascript
parseModules(file) {
  // 分析模块
  const entry = this.getModuleInfo(file);
  const temp = [entry];

  // 递归遍历，获取引入模块代码
  this.getDeps(temp, entry)
}


/**
 * 获取依赖
 *  @param {*} temp
 *  @param {*} module
*/
getDeps(temp, {deps}) {}
```

在`getDeps`中，我们可以通过第二个参数获取到依赖对象，其次通过遍历这个对象，一一执行一下`getModuleInfo`函数，获取各个依赖模块的解析内容，并保存到`temp`。

最后，再自调用一下`getDeps`，传入引入模块内容，继续递归遍历。

```javascript
getDeps(temp, {deps}) {
  // 遍历依赖
  Object.keys(deps).forEach(key => {
    // 获取依赖模块代码
    const child = this.getModuleInfo(deps[key]);
    temp.push(child);
    // 递归遍历
    this.getDeps(temp, child);
  })
}
```

这里还需要进行查重，比如在多个文件都引入了`b.js`的话，`temp`数组就会保存多个`b.js`的内容对象，因此我们可以先查重一下，如果`temp`对象没有该模块，我们再执行后面的操作。

```javascript
getDeps(temp, {deps}) {
  Object.keys(deps).forEach(key => {
    // 去重
    if (!temp.some(m => m.file === deps[key])) {
      const child = this.getModuleInfo(deps[key]);
      temp.push(child);
      this.getDeps(temp, child);
    }
  })
}
```

这时候，我们模块解析的操作已经完成了差不多了。

最后我们最需要将`temp`数组，转换成对象，即跟`__webpack_modules__`类似，以路径为`key`名，然后`value`为对应的内容信息。

```javascript
parseModules(file) {
  const entry = this.getModuleInfo(file);
  const temp = [entry];

  this.getDeps(temp, entry)

  // 将temp转成对象
  const depsGraph = {};
  temp.forEach(moduleInfo => {
    depsGraph[moduleInfo.file] = {
      deps: moduleInfo.deps,
      code: moduleInfo.code
    }
  })

  return depsGraph;
}
```

这时候，我们在`run()`函数保存一下解析结果，就完成了第一步操作了。

```javascript
run() {
  // 解析模块
  this.depsGraph = this.parseModules(this.entry);
}
```

#### 打包

下一步就是执行打包操作了，我们先封装一个`bundle`函数。

```javascript
run() {
  // 解析模块
  this.depsGraph = this.parseModules(this.entry);

  // 打包
  this.bundle()
}

/**
*  生成bundle文件
*/
bundle() { }
```

首先我们先把简单的部分完成了，就是生成打包文件。

我们要用到`fs`模块，先识别打包路径存不存在，不存在的话新建一个目录，其次就写入`bundle`文件。

```javascript
bundle() {
  const content = `console.log('Hello World')`;

  // 生成bundle文件
  !fs.existsSync(this.output.path) && fs.mkdirSync(this.output.path);
  const filePath = path.join(this.output.path, this.output.filename);
  fs.writeFileSync(filePath, content);
}
```

这时运行一下打包命令，项目里就会出现一个`dist`文件夹，里面会有一个`index.js`。

```javascript
console.log('Hello World')
```

接下来我们就得来实现`bundle`文件的内容。

首先它是一个匿名函数只执行的方式，然后它接收一个参数`__webpack_modules__`，即我们前面解析文件的结果。

```javascript
(function(__webpack_modules__){
  ...
})(this.depsGraph)
```

其次，我们需要是实现一下`__webpack_require__`函数，它接收一个`moduleId`参数，即路径参数。

然后我们还需要去调用一下`__webpack_require__`，并传入入口文件路径。

```javascript
(function(__webpack_modules__){
  function __webpack_require__(moduleId) {
    ...
  }
  __webpack_require__(this.entry)
})(this.depsGraph)
```

前面我们又看到，`babel`将代码转义成`commonJS`，因此我们需要来实现一下`require`函数，因为`JavaScript`本身不具备。

`require`函数的实质就是返回引入文件的内容。

同时，我们还需要新建一个`exports`对象，这样子模块导出的内容就可以保存到里面去了，最后也需要将其返回出去。

```javascript
;(function (__webpack_modules__) {
  function __webpack_require__(moduleId) {
    // 实现require方法
    function require(relPath) {
      return __webpack_require__(__webpack_modules__[moduleId].deps[relPath])
    }
    // 保存导出模块
    var exports = {}

    return exports
  }
  __webpack_require__(this.entry)
})(this.depsGraph)
```

最后，就只需要来执行一下入口文件的代码即可。

这里还是使用一个匿名函数并自调用。

```javascript
;(function (__webpack_modules__) {
  function __webpack_require__(moduleId) {
    // 实现require方法
    function require(relPath) {
      return __webpack_require__(__webpack_modules__[moduleId].deps[relPath])
    }
    // 保存导出模块
    var exports = {}

    // 调用函数
    ;(function (require, exports, code) {
      eval(code)
    })(require, exports, __webpack_modules__[moduleId].code)

    return exports
  }
  __webpack_require__(this.entry)
})(this.depsGraph)
```

这时候我们再将这段代码，换到`content`变量中去。

```javascript
bundle() {
  const content = `
    (function (__webpack_modules__) {
      function __webpack_require__(moduleId) {
        function require(relPath) {
          return __webpack_require__(__webpack_modules__[moduleId].deps[relPath])
          }
          var exports = {};
          (function (require,exports,code) {
            eval(code)
          })(require,exports,__webpack_modules__[moduleId].code)
          return exports
        }
        __webpack_require__('${this.entry}')
    })(${JSON.stringify(this.depsGraph)})
  `;

  // 生成bundle文件
  !fs.existsSync(this.output.path) && fs.mkdirSync(this.output.path);
  const filePath = path.join(this.output.path, this.output.filename);
  fs.writeFileSync(filePath, content);
}
```

然后执行打包，就可以看到完整的打包内容了。

```javascript
;(function (__webpack_modules__) {
  function __webpack_require__(moduleId) {
    function require(relPath) {
      return __webpack_require__(__webpack_modules__[moduleId].deps[relPath])
    }
    var exports = {}
    ;(function (require, exports, code) {
      eval(code)
    })(require, exports, __webpack_modules__[moduleId].code)
    return exports
  }
  __webpack_require__('./src/index.js')
})({
  './src/index.js': { deps: { './a.js': './src/a.js' }, code: '"use strict";\n\nvar _a = require("./a.js");\n\nconsole.log(_a.msg);' },
  './src/a.js': {
    deps: { './b.js': './src/b.js' },
    code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.msg = void 0;\n\nvar _b = require("./b.js");\n\nvar msg = "Hello ".concat(_b.something);\nexports.msg = msg;',
  },
  './src/b.js': {
    deps: {},
    code: '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.something = void 0;\nvar something = \'World\';\nexports.something = something;',
  },
})
```

最后，我们执行一下，看看能不能打印出`Hello World`。

```shell
node ./dist/index.js
```
