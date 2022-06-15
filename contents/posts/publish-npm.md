---
title: 利用github Actions发布npm和release
description: 利用github Actions发布npm和release
date: 2021-07-30T08:00:00.000+00:00
author: Dewey Ou
---

[[toc]]

最近自己造了个轮子——[ga-tracker](https://github.com/OUDUIDUI/ga-tracker)，即适用于UniApp和微信小程序的谷歌统计 (Google Analytics) SDK，喜欢的朋友可以点个Star！
然而当每次更新或修复bugs的时候，都需要手动去更新`npm`包以及`release`包，因此就想尝试一下利用**`github Actions`**来实现自动发布`npm`和`release`。


> 关于`github actions`的学习，可以去看看[官方文档](https://docs.github.com/cn/actions)

## 配置npmToken
当我们想使用`github actions`将文件上传到`npm`库时，则需要在`github`配置一下`npm access tokens`。


来到[`npmjs`](https://www.npmjs.com/)下，登录你的账号，然后点击`Access Tokens`。

![WeChatdb6470d685993f4bb43d203021519421.png](/images/docs/publish-npm-by-github-actions/1.png)

然后点击`Generate New Token`创建一个新的`Token`。
![WeChat3da491aff53c856dad95c4cf5a2b0d65.png](/images/docs/publish-npm-by-github-actions/2.png)

然后选择`Automation`，确定创建`Token`。

![WeChat565126ef4c337c96594badfcfe868857.png](/images/docs/publish-npm-by-github-actions/3.png)

然后来到你的`Github`，选择你的项目，点击`Settings`，然后选择`Secrets`，点击`New repository secret`。

![WeChat5a182589fc211e0089597980455670b8.png](/images/docs/publish-npm-by-github-actions/4.png)

输入名称和`Tokens`，然后点击保存。

![截屏2021-07-27 17.07.18.png](/images/docs/publish-npm-by-github-actions/5.png)

## 编辑`github actions`配置文件
在你的项目下，新建`.github`目录，然后再新建一个`workflows`目录，接着在里面新建一个`yml`文件。

github会自动检测`.github/workflows`下的所有配置文件，并在每一次链接到远程仓库的时候执行它们。

![截屏2021-07-27 17.39.24.png](/images/docs/publish-npm-by-github-actions/6.png)

在编辑之前，我先简单说明一下我的项目结构。

我的项目打包文件都放在`dist`路径下，在里面除了打包文件之外，还包含`package.json`和`README.md`，这两个文件是上传到`npm`必需的。

![截屏2021-07-27 17.49.41.png](/images/docs/publish-npm-by-github-actions/7.png)

接下来我们开始编辑配置文件。
```yaml
## action名称
name: Push Release

## 当代码合并到master分支的时候，执行下列脚本
on:
  push:
    branches: [ master ]

## 任务
jobs:
	## publish-npm任务
  publish-npm:
  	## 在ubuntu最新版本的虚拟机执行
    runs-on: ubuntu-latest
    ## 设置变量
    strategy:
      matrix:
        node-version: [ 12.x ]
    steps:
      ## 检查并切换到master分支
      - name: 检查master分支
      	## 使用actions/checkout插件
        uses: actions/checkout@master

      ## 安装node
      - name: 设置Node.js
      	## 使用actions/setup-node插件
        uses: actions/setup-node@master
        with:
        	## node版本
          node-version: ${{ matrix.node-version }}

			## 初始化缓存
      - name:  缓存
        uses: actions/cache@v2
        id: cache-dependencies
        with:
          path: node_modules
          key: ${{runner.OS}}-${{hashFiles('**/yarn.lock')}}

			## 读取当前版本号
      - name: 读取当前版本号
        id: version
        uses: ashley-taylor/read-json-property-action@v1.0
        with:
        	## 读取dist/package.json的，而不是根路径下的package.json
          path: ./dist/package.json
          property: version

			## 发布NPM包
      - name: 发布NPM包
      	## 执行发布代码
        run: |
          cd dist
          npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN
          npm publish
        env:
        	## 配置 npm access token 环境变量
          NPM_TOKEN: ${{secrets.NPM_ACCESS_TOKEN}}

			## 创建GitHub Release
      - name: 创建GitHub Release
        id: create_release
        uses: actions/create-release@latest
        env:
        	## 配置github token （这个无需去github配置，默认存在的）
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
        	## 标签名
          tag_name: v${{steps.version.outputs.value}}
          ## release名
          release_name: v${{steps.version.outputs.value}}
          ## 是否为草稿
          draft: false
          ## 是否为预发布
          prerelease: false

			## 上传Release Asset
      - name: 上传Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
        	## 上传URL为创建GitHub Release步骤的输出值，可通过配置的id获取
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          ## 上传文件信息
          asset_path: ./dist/index.js
          asset_name: index.js
          asset_content_type: application/js

			## 刷新缓存
      - name: 刷新缓存
        run: |
          curl https://purge.jsdelivr.net/npm/iemotion-pic@latest/dist/name.json

```
## 执行`github actions`

当编辑好配置文件后，只需将代码提交到`github`，并合并到`master`分支，`github`就会自动执行脚本。

你也可以在项目主页，点击`actions`选项查看。

![截屏2021-07-27 18.13.04.png](/images/docs/publish-npm-by-github-actions/8.png)

同时你可以点进去，进一步查看执行情况，如果报错了你也能准确定位到哪里出问题了。

![截屏2021-07-27 18.14.53.png](/images/docs/publish-npm-by-github-actions/9.png)

此时看看npm包和release，也都都更新到最新版本了。


