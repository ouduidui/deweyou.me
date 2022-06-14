---
lang: zh-CN
title: Git工作原理及常用命令
description: Git工作原理及常用命令
date: 2020-12-25T08:00:00.000+00:00
author: Dewey Ou
---

# Git工作原理及常用命令

## git介绍

git（读音/ɡɪt/）是一个开源的分布式版本控制系统，可以有效、高速地处理从很小到非常大的项目版本管理。git是Linus Torvalds为了帮助管理Linux内核开发而开发的一个开放源码的版本控制软件。

git保存的不是文件的变化或者差异，而是一系列不同时刻的文件快照。在进行提交操作时，git回报纯一个提交对象（commit object）。该提交对象会包含一个指向暂存内容快照的指针。但不仅仅是这样，该提交对象还包含作者的姓名和邮箱、提交时输入的信息以及指向它的父对象的指针。

## git安装及配置

### 安装

#### Linux

```shell
sudo yum install git
```

#### Mac

```shell
## 需要先安装homebrew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

## 安装git
brew install git
```

#### Win

直接从[官网](https://git-scm.com/downloads)下载安装。

### 配置

```shell
## 配置昵称
git config --global user.name "userName"

## 配置邮箱
git config --global user.email "userEmail"
```

## git存储

### git分区

git存储分为四个部分：

- **workspace：工作空间**
  - 我们开发代码的目录
- **index：暂存区**
  - `.git` 目录下的`index` 文件
- **repository：本地仓库**
  - 通过`git clone` 将远程的代码下载到本地，代码库的元数据信息在根目录下的`.git` 目录下
- **remote：远程仓库**
  - 比如`github` 、`gitlab` 等远程仓库

![1599458527825-5d2a015c-bf70-4b18-8ba5-c4b7b1149395](/posts/git/1.png)

- 工作区  —`git add` —>  暂存区 —`git commit` —> 本地仓库 —`git push` —> 远程仓库
- 远程仓库 —`git fetch` —> 拉取最新代码至本地仓库，并使用refs/remotes路径下对应分支文件，记录远程分支末端`commit_id` —`git merge` —> 工作区
-  远程仓库 —`git pull` —> 拉取最新代码至本地仓库，并自动合并代码至工作区，且使用refs/remotes路径下对应分支文件，记录远程分支末端`commit_id`

#### git fetch 和 git pull

`git fetch` 是将远程主机的最新内容拉取到本地，需要用户检查代码以后决定是否合并到工作本机分支中。

具体操作如下：

```shell
## 本地新建一个template分支，并将远程origin仓库的master分支代码下载到本地template分支
git fetch origin master:template

## 比较远程代码与本地代码的区别
git diff

## 将temp分支合并到本地master分支
git merge temp

## 不想保留分支，可以将其删除
git branch -d template
```

`git pull` 可以认为是`git fetch` 和`git merge` 两个步骤的合并。

具体用法：

```shell
## 将远程主机的某个分支，与本地的指定分支合并
git pull <远程主机名> <远程分支名>:<本地分支名>
```

`git pull` 合并后可能会出现冲突，需要手动解决冲突。

```shell
error:Your local changes to the following files would files would be overwritten by merge:Please commit your changes or stash them before you merge.
```

解决冲突的方式是先把本地的代码暂存。

```shell
## 先将本地修改暂存起来
git stash
## 查看保存信息
git stash list
## 拉取内容
git pull
## 还原暂存内容
git stash pop
```

### git内部存储

本地项目里面的`.git` 目录的文件如下：

```shell
total 184
-rw-r--r--    1 ouduidui  staff     7B 12  8 10:28 COMMIT_EDITMSG
-rw-r--r--    1 ouduidui  staff   350B 12  3 13:17 FETCH_HEAD
-rw-r--r--    1 ouduidui  staff    30B 12  3 13:17 HEAD
-rw-r--r--    1 ouduidui  staff    41B 12  8 10:29 ORIG_HEAD
-rw-r--r--    1 ouduidui  staff   620B 12  3 13:17 config
-rw-r--r--    1 ouduidui  staff    73B 10  4 11:16 description
drwxr-xr-x   12 ouduidui  staff   384B 10  4 11:16 hooks
-rw-r--r--    1 ouduidui  staff    63K 12  8 10:29 index
drwxr-xr-x    3 ouduidui  staff    96B 10  4 11:16 info
drwxr-xr-x    4 ouduidui  staff   128B 10  4 11:17 logs
drwxr-xr-x  259 ouduidui  staff   8.1K 12  3 10:07 objects
-rw-r--r--    1 ouduidui  staff   1.1K 12  3 13:16 packed-refs
drwxr-xr-x    5 ouduidui  staff   160B 10  4 11:17 refs
```

|  文件/路径名   |                             介绍                             |
| :------------: | :----------------------------------------------------------: |
| COMMIT_EDITMSG |                          commit编辑                          |
|   FETCH_HEAD   | 是一个版本链接，记录在本地的一个文件中，指向着目前已经从远程仓库取下来的分支的末端版本 |
|      HEAD      |                     代码库当前分支的指向                     |
|   ORIG_HEAD    | 针对某些危险操作，git通过记录HEAD指针的上次所在的位置ORIG_HEAD提供了回退的功能。当你发现某些操作失误了，比如错位的`reset` 到一个很早很早的版本，可以使用`git reset --hard ORIG_HEAD` 回退到上一次`reset` 之前 |
|     config     |                     代码库基本的配置文件                     |
|  description   |                           项目描述                           |
|     hooks      | 存储git钩子的目录，钩子只在特定时间发生时触发的脚本，比如提交之前和提交之后 |
|     index      |                            暂存区                            |
|      info      |                      存储git信息的目录                       |
|      logs      |                       存储git操作日志                        |
|    objects     |                存储git各种对象及备用的对象库                 |
|  packed-refs   | git 会定期执行一个叫`git gc` 的命令，gc 是 garbage collection 的缩写。这个命令会将一些暂时用不到的 commit 和分支的具体内容打包起来，打包在 objects 文件夹下的 pack 文件夹下，用来压缩所占用的体积。这个文件就是用来记录这些信息的 |
|      refs      |       存储git各种引用的目录，包含分支、远程分支和标签        |

### git状态

我们可以通过`git status` 查看本地存储状态。

```shell
git status

## Changes to be committed：代表被add的文件，被加载到了暂存区
## Changes not staged for commit：代表在当前分支中被修改的文件，还没有被add，存储在工作区
```

## git常用命令

### 配置git

```shell
## 配置用户名
git config --global user.name "username"

## 配置邮箱
git config --global user.email "userEmail"
```

### 初始化

```shell
git init
```

### 添加文件并提交代码

```shell
## 添加文件
git add <filename>

## 添加全部文件
git add .

## 强制提交文件，可提交.gitinore中配置的文件
git add -f <filename>

## 提交代码
git commit -m "commit message"
```

### 查看当前仓库状态

```shell
git status
```

### 对比文件改动内容

```shell
git diff <filename>
```

### 查看git日志

```shell
git log
```

### 版本回退

```shell
## 版本回退到第N个版本前
git reset --hard HEAD~N

## 版本回退（切换）到指定版本
git reset --hard <commit id>
```

### 查看关联仓库链接信息

```shell
git remote -v
```

### 关联远程仓库

```shell
git remote add origin <url>
```

### 推送到远程库

```shell
git push

## 第一次推送
git push -u origin <branch name>

## 推送到其他分支
git push origin <branch name>
```

### 克隆代码

```shell
git clone <url>

## 克隆指定分支代码
git clone -b <branch name> <url>
```

### 创建分支

```shell
git branch <branch name>
```

### 切换分支

```shell
git checkout <branch name>

## 创建并切换分支
git checkout -b <branch name>
```

### 查看分支

```shell
git branch

## 查看远程分支
git branch -r

## 查看所有分支
git branch -a
```

### 合并分支

合并某分支到当前分支，若存在冲突会提示手动修改后在提交，`git merge` 默认为fast forward模式

```shell
## fast forward模式
git merge <other branch name>

## 禁用fast forward模式
git merge --no-ff -m "commit message" <other branch name>
```

### 查看分支合并图

```shell
git log --graph --oneline --abbrev-commit
```

### 删除分支

```shell
git branch -d <branch name>

## 强制删除
git branch -D <branch name>
```

### 保存工作空间

```shell
git stash
```

### 查看保存的工作空间

```shell
git stash list
```

### 从保存的工作空间恢复

```shell
git stash apply

## 若存在多个保存的工作空间 （n为序号，从0开始）
git stash apply stash@{n}

## 从保存的工作空间恢复并删除保存空间
git stash pop

## 若存在多个保存的工作空间 （n为序号，从0开始）
git stash pop stash@{n}
```

### 删除保存的工作空间

```shell
git stash drop

## 若存在多个保存的工作空间 （n为序号，从0开始）
git stash drop stash@{n}
```

### 将其他分支的提交应用到当前分支

```shell
git cherry-pick <commit id>
```

### 抓取代码

```shell
git pull
```

### 将本地分支与远程分支关联

```shell
git branch --set-upstream-to <local branch name> origin/<remote branch name>
```

### 建立标签

```shell
## 给当前分支建立标签
git tag <tag name>

## 给某个提交建立标签
git tag <tag name> <commit id>

## 给某个提交建立标签并添加注释
git tag <tag name> -m "description" <commit id>
```

### 查看标签

```shell
git tag
```

### 查看标签信息

```shell
git show <tag name>
```

### 删除本地标签

```shell
git tag -d <tag name>
```

### 删除远程标签

```shell
git push origin :<tag name>
```

### 推送标签至远程仓库

```shell
## 推送所有本地标签 
git push --tag

## 推送指定标签
git push origin <tag name>
```

