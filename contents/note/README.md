---
title: Quick Notes / Tips
description: CSS中的剪切和遮罩
date: 2022-06-25
author: Dewey Ou
---

[[toc]]

## husky

当你想要给你的项目在提交代码前做一些检查，比如单测或者格式检查，可以使用`husky`：

```bash
npx husky install
npx husky add .husky/pre-commit "your script"
```

## ssh 

Mac生成ssh密钥对：

```bash
ssh-keygen -t rsa -C "your email"
```