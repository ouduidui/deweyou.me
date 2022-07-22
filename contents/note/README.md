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

## ITerm2 + ohMyZsh + Powerlevel10k

> [ITerm2下载地址](https://iterm2.com/downloads.html)

安装 `ohMyZsh`:

```bash
# via curl
$ sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# via wget
$ sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"
```

安装 `Powerlevel10k`:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

修改主题为 `Powerlevel10k`:

```bash
vi ~/.zshrc

## 找到 ZSH_THEME 改成以下：
ZSH_THEME="powerlevel10k/powerlevel10k"

# 保存后执行
source ~/.zshrc
```

重开 `ITerm2` 或执行 `exec $SHELL` 来重启 `zsh`，会自动跳出 `Powerlevel10k` 的引导设置界面。如果没有自动跳出，也可以通过指令触发：

```bash
p10k configure
```