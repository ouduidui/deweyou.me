---
lang: zh-CN
title: 实习第一天，上司让我学习一下Git Flow
description: 实习第一天，上司让我学习一下Git Flow
date: 2022-03-13
---

# 实习第一天，上司让我学习一下Git Flow

## 简述Git Flow

首先，`Git Flow`并不是`Git`的替代品，`Git Flow`只是把标准的`Git`命令用脚本组合了起来，形成比较有效而简单的命令。

`Git Flow`只是给我们提供一个更简便的工作流程命令，而更重要的是我们需要去学习和理解关于版本控制系统的工作流程，才能有效的迭代产品，避免混乱。

而当项目处于一个多人协作的状态下，工作流程显得非常之重要。假设当两个甚至多个开发者同时再开发各自新功能时，如果在同一分支上进行协作时，这必然会产生大量的冲突。而工作流程的做法，就是每个开发者可以各自切出一个独立分支，当各自功能实现并且测试成功后，再自行合并到`master`分支中，甚至无需等待其他功能实现再一起发布。

## 分支应用情境

在`Git Flow`中，主要的分支有`master`、`develop`、`hotfix`、`release`、`feature` 这五种分支。`master`和`develop`分支是我们最常见的分支，它们被称作长期分支，一直存活在整个工作流程中，而其它的分支大部分会因任务结束而被删除。

![git flow分支应用示意图](/images/docs/git-flow/1.png)

### master分支

该分支主要用来存放稳定、随时可以上线的版本。

这个分支的来源只能从别的分支合并过来，开发者不会直接`commit`到这个分支上。

通常我们也会在这个分支上的提交打上版本号标签。

### develop分支

这个分支主要是所有开发的基础分支。

当要添加功能时，所有功能都是从这个分支切出去的，而功能分支实现后，也都会合并回来这个分支中。

### hotfix分支

当线上产品发生了紧急问题的时候，就会从`master`分支中开一个`hotfix`分支出来进行修复。

当`hotfix`分支修复完成之后，就会合并到`master`分支中，并且也会合并到`develop`分支中。

### release分支

当`develop`分支完成需求后，就可以从`develop`分支中开一个`release`分支，进行上线前最后的测试。

测试完成后，释放`release`分支将会同时合并到`master`以及`develop`分支中。

### feature分支

当我们需要补充功能的时候，就会从`develop`分支中开一个`feature`分支进行功能开发。

当功能实现后，在将`feature`分支合并到`develop`分支中，等待最后的测试发布。

### 示意图

![git flow分支应用示意图](/images/docs/git-flow/2.png)

## 安装与使用

### 安装

#### Mac

```shell
brew install git-flow
```

如果没有安装`brew`的话可使用下列命令进行安装：

```shell
 /bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

#### Win

[Windows安装git flow](https://github.com/nvie/gitflow/wiki/Windows)

### 初始化

先将项目克隆到本地。

```shell
git clone <project-url>
```

初始化`Git Flow`。

```shell
git flow init
```

命令行会提示你是否修改`Git Flow`提供的默认分支前缀。不同场景的分支前缀不同，默认情况下分支前缀是这样的。

|  场景  | 分支前缀 |
| :----: | :------: |
| 新功能 | feature  |
| 预发布 | release  |
| 热修复 |  hotfix  |
| 打标签 |    空    |

```shell
Which branch should be used for bringing forth production releases?
   - develop
   - master
Branch name for production releases: [master]

Which branch should be used for integration of the "next release"?
   - develop
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []
```

分支前缀的作用是区分不同分支的使用场景，同时当你使用`Git Flow`命令时就不需要手动增加分支前缀，`Git Flow`会帮你加上。

通常情况下不需要修改默认的命名前缀，只需要加上`-d`就可以跳过修改命名步骤。

```shell
git flow init -d
```

### feature场景

![feature场景](/images/docs/git-flow/3.png)

当我们需要开发一个新功能的时候，此时需要基于`develop`分支拉出`feature`分支进行开发，即`feature`场景的生命周期开始。

通常来说，一种场景的完整生命周期至少包含以下几种行为：

- **start** ：开始开发
- **publish** ：发布到远程分支
- **finish** ：完成开发、合并分支

#### start

新功能开始开发前，需准备好开发分支。

```shell
git flow feature start <feature-name>
```

执行上面命令后，将会在本地创建一个名为`<feature-name>` 的分支，并切换到该分支。

**而且无论你当前处于哪个分支，它都会基于本地`develop`分支创建的。**

上述命令相当于执行了下面的`Git`操作。

```shell
git checkout -b feature/<feature-name> develop
```

> 需要注意的一点是，该分支是基础本地的`develop` 分支创建，所以执行此命令钱一般需要拉取最新的远程代码。

#### publish

在本地开发完成新功能并进行`commit`操作后，需要将本地代码提交到远程仓库。

```shell
git flow feature publish <feature-name>
```

该命令主要做了三件事情：

- 创建一个名为`feature/<feature-name>`的远程分支
- 本地分支`track`远程分支
- 如果本地存在还没提交的代码，就进行代码提交

```shell
git push origin feature/<feature-name>
git push --set-upstream origin feature/<feature-name>
git push origin
```

当你执行后`publish`操作后，后续还需要进行代码提交的话，只需执行正常的`push`命令既可。

```shell
git push
```

#### finish

当功能开发完毕后就将进入测试阶段，此时需要将该分支合并到`develop`分支。

```shell
git flow feature finish <feature-name>
```

该命令也主要做了三件事情：

- 切换到`develop`分支
- 合并代码到`develop`分支
- 删除本地`feature/<feature-name>`分支

```shell
git checkout develop
git merge feature/<feature-name>
git branch -d feature/<feature-name>
```

`Git Flow`的`merge`操作与默认的`git merge`操作有些不同。

默认情况下它会检查本次`merge`有多少`commit`记录，如果仅有一条的话采用`fast-forward`模式，即只移动`HEAD`指针而不会生成提交记录；如果超过一条`commit`的话，这采用`no-ff`模式，该模式下则会多生成一条`merge`的`commit`记录。

这样做的好处是当有多条提交记录时方便进行代码回退和记录监察，而只有单条提交记录的时候则简化代码提交记录从而便于管理。



当`finish`操作过程中，如果`merge`发生了冲突，则会终端`finish`操作，不会删除`feature/<feature-name>`分支，同时也处于`develop`分支上。

当本地冲突解决并`commit`后，重新进行`finish`操作即可。



另外，`finish`指令还支持三个附加参数：

- `-r` ：即merge前先执行`rebase`，但即使`rebase`后符合`fast-forward`条件也不一定会用`fast-forward`。
- `-F` ：即合并完成连同远程分支一并删除。
- `-k` ：即保留本地`feature`分支，不执行`delete`动作。

### release场景

![release场景](/images/docs/git-flow/4.png)

当新功能开发完成后，将进入测试阶段，此时需要基于`develop`分支拉出`release` 分支进行集成测试，也有将`release`场景作为预发布环境进行测试。

在这种情况下，一般而言`release`只有少数改动。

#### start

使用`start`开启一个`release`场景。

```shell
git flow release start <release-name>
```

该命令会基于本地的`develop`分支创建一个`release/<release-name>`分支，并切换到这个分支。

> 需要注意一点是，如果本地还有未`finish`的`release`分支的话，将不允许使用`start`指令开启新的`release`分支，这一点是对并行发布的一个限制。

#### publish

为了让其他协同人员能够看到该分支并一同测试，需要将其发布出去。

```shell
git flow release publish <release-name>
```

#### finish

待测试通过后需要发布正式版：

```shell
git flow release finish <release-name>
```

该命令的动作会比较多，大致是：

- `git fetch`，拉取最新的代码
- 将分支合并到`master`分支
- 生成名为`<release-name>`的`tag`
- 将分支合并到`develop`分支
- 删除`release/<release-name>`分支
- 切换回`develop`分支

如果`merge`产生冲突不会终止流程，只是不会将本地的`release`分支删除。待解决完冲突后需再次执行`finish`操作。



`finish`只是完成了本地代码的一系列操作，可使用下列命令进行推送所有的分支和`tag`。

```shell
git push origin --all
git push origin --tag
```

### hotfix场景

![release场景](/images/docs/git-flow/5.png)

如果在线上发现了bug，需要进行紧急修复的时候，就需要用到了`hotfix`场景。

#### start

```shell
git flow hotfix start <hotfix-name>
```

该命令将从`master`分支创建了一个`hotfix/<hotfix-name>`的分支并切换到该分支。

#### finish

`hotfix`没有`publish`命令，因为`Git Flow`认为`hotfix`应该是小范围的改动，不需要其他协同人员参与。

但本地修改结束并进行`commit`操作后，则执行`finish`操作。

```shell
git flow hotfix finish <hotfix-name>
```

该命令所做任务与`release`基本相同，先拉取代码，然后将分支合并到`master`、`develop`分支中，并且打上tag，然后删除该分支，最后切回`develop`分支。

## 其他代码工作流

与`Git Flow`相似的代码管理工作流还有[Github Flow](https://guides.github.com/introduction/flow/)和[Gitlab Flow](https://docs.gitlab.com/ee/topics/gitlab_flow.html)。

- `Github Flow`是简化版的`Git Flow`，它使用了`main`和`feature`来管理代码，它只有一个长期分支，就是`main`。
- `Gitlab Flow`更关注代码的持续集成，一个版本需要创建测试环境、预览环境、生成环境的分支，最后汇总到`stable branch`分支用于发布。

