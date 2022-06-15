---
title: Git Commit Message 应该怎么写
description: Git Commit Message 应该怎么写
date: 2021-05-10T08:00:00.000+00:00
author: Dewey Ou
---

[[toc]]

因为入职至今，公司也没有太规定一个代码提交规范，所以一直以来，我代码提交的`commit message`都是简单的一句话说明了本次代码改动内容，有时候会更加精简。

但时间长了之后，当我需要回头找一下某次提交记录的时候，就会发现不太好找，首先没有一个具体的分类，比如是添加功能、还是修复bug、还是更新文档等等；其次就是有一些`message`写得不是很清晰，不太能一眼明了那次改动是什么内容。

后来决定，需要重新学一学关于`commit message`的写法规范。

## Commit Message的好处

- 每一条提交记录的`message`能够提供更多的有效信息，方便我们快速浏览；
- 可以使用`git log --grep <keyword>`过滤掉某些`commit`，便于快速查找信息；
- 可以直接从`commit`生成`Change log`。

## Commit Message格式

目前`Commit Message`规范使用较多的是[Angular团队的规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)，继而衍生了[Conventional  Commits sepcification](https://www.conventionalcommits.org/)。

`Commit Message`包括三个部分：`Header`、`Body`和`Footer`。格式如下：

```shell
<type>(<scope>): <subject>
< 空一行 >
<body>
< 空一行 >
<footer>
```

其中，`Header`是必填的，`Body`和`Footer`可以省略不写。

### Header

`Header`包含三个部分：`type`、`scope`和`subject`。其中`scope`是可选项。

```shell
<type>(<scope>): <subject>

## example
feat($route): add support for the `reloadOnUrl` configuration option
```

#### type

`type`是用于说明`commit`的类别，具体的标识如下：

- **`feat`**:    一个新的功能（`feature`）；
- **`fix`**:    修复`bug`;
- **`docs`**:    修改文档，比如`README.md`、`CHANGELOG.md`等；
- **`style`**:    修改代码的格式，不影响代码运行的变动，比如空格、格式化代码、补齐句末分号等等；
- **`refactor`**:   代码的重构，没有新功能的添加以及bug修复的代码改动；
- **`perf`**:    优化代码以提高性能；
- **`test`**:    增加测试或优化改善现有的测试；
- **`build`**:    修改影响项目构建文件或外部依赖项，比如`npm`、`gulp`、`webpack`、`broccoli`等；
- **`ci`**:    修改CI配置文件和脚本；
- **`chore`**:    其他非src路径文件和测试文件的修改，比如`.gitignore`、`.editorconfig`等；
- **`revert`**:    代码回退；

#### scope

`scope`是用于说明`commit`的影响范围，比如数据层、控制层、视图层等等，视项目不同而不同。

如果你的修改影响了不止一个`scope`，就可以使用`*`代替。

#### subject

`subject`是`commit`的目的简单描述，不超过50个字符，结尾不需要句号。

### Body

`Body`部分是对本次`commit`的详细描述，可以分为多行。

`Body`部分应该说明代码变动的动机，以及与以前行为的对比。

```shell
More detailed explanatory text, if necessary.  Wrap it to about 72 characters or so. 

Further paragraphs come after blank lines.

- Bullet points are okay, too
- Use a hanging indent
```

### Footer

`Footer`部分主要用于两种情况：不兼容变动和处理`Issue`。

#### 不兼容变动

如果当前代码与上一个版本不兼容，则`Footer`部分以`BREAKING CHANGE:`开头，后面就是对变动的描述、以及变动理由和迁移方法。

```shell
BREAKING CHANGE: Previously, $compileProvider.preAssignBindingsEnabled was set to true by default. This means bindings were pre-assigned in component constructors. In Angular 1.5+ the place to put the initialization logic relying on bindings being present is the controller $onInit method.

To migrate follow the example below:

Before:

```js
angular.module('myApp', [])
.component('myComponent', {
  bindings: {value: '<'},
  controller: function() {
    this.doubleValue = this.value * 2;
  }
});
```

After:
```js
angular.module('myApp', [])
  .component('myComponent', {
    bindings: { value: '<' },
    controller() {
      this.$onInit = function() {
        this.doubleValue = this.value * 2
      }
    },
  })
```

Don't do this if you're writing a library, though, as you shouldn't change global configuration then.
```

#### 处理Issue

如果当前`commit`是针对处理某个`issue`，那么可以在`Footer`部分标注处理的`issue`。

```shell
Fixes #234
```

如果想关闭这个`issue`的话：

```shell
Closes #234
```

## 相关插件

### Commitizen - 快速编写 Commit Message

> https://github.com/commitizen/cz-cli

我们可以利用第三方插件`Commitizen`来快速编写我们的`Commit Message`。

首先全局安装一下`Commitizen`。

```shell
npm i -g commitizen
```

然后在我们的项目路径下，运行下列命令，使其支持`Angular`的`Commit Message`格式。

```shell
commitizen init cz-conventional-changelog --save --save-exact
```

安装完成后，我们每次提交代码，就不再使用`git commit -m`命令了，而是使用`git cz`来执行操作。

```shell
git cz
```

先选择一下`Commit Type`，然后回车确定。

```shell
cz-cli@4.2.4, cz-conventional-changelog@3.3.0

? Select the type of change that you're committing: (Use arrow keys)
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code (white-space, for
matting, missing semi-colons, etc)
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
(Move up and down to reveal more choices)
```

然后输入`scope`的信息。

```shell
What is the scope of this change (e.g. component or file name): (press enter to skip)
```

然后输入`subject`信息。

```shell
Write a short, imperative tense description of the change (max 85 chars):
```

紧接着配置`Boby`的信息。

```shell
Provide a longer description of the change: (press enter to skip):

? Are there any breaking changes? Yes

? A BREAKING CHANGE commit requires a body. Please enter a longer description of
 the commit itself:
```

最后配置`Footer`信息。

```shell
Describe the breaking changes:

? Does this change affect any open issues? Yes
? Add issue references (e.g. "fix #123", "re #123".):
```

### Commitlint — 校验你的 Commit Message

>https://github.com/marionebl/commitlint

`Commitlint`可以帮助我们检查`Commit Messages`, 如果我们提交的不符合指向的规范的话，就会直接拒绝提交。

因此，我们也需要向它提供一份校验的配置，这里推荐 [@commitlint/config-conventional](https://link.zhihu.com/?target=https%3A//github.com/marionebl/commitlint/tree/master/%40commitlint/config-conventional) (符合 Angular团队规范)。

安装：

```shell
npm i -D @commitlint/config-conventional @commitlint/cli
```

同时需要在项目目录下创建配置文件`.commitlintrc.js`，写入：

```javascript
module.exports = {
  extends: [
    "@commitlint/config-conventional"
  ],
  rules: {}
};
```

更多相关配置可以去查阅一下官方文档。

### Standard Version — 自动生成 CHANGELOG

> https://github.com/conventional-changelog/standard-version

当我们的 `Commit Message` 符合 Angular团队规范的情况下，我们就可以借助`standard-version`这样的工具，自动生成 CHANGELOG，甚至是语义化的版本号([Semantic Version](https://link.zhihu.com/?target=http%3A//semver.org/lang/zh-CN/))。

安装：

```shell
npm i -S standard-version
```

`package.json`配置：

```json
"scirpt": {
  "release": "standard-version"
}
```

