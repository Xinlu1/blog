---
title: 我的 Ubuntu 系统配置
date: 2016-04-09 15:40:32
updated: 2016-04-11 00:00:00
categories:
- 笔记小抄
tags: 
- ubuntu
- github
- vim
- config
---


安装 Ubuntu 几次便会形成一套 SOP，在此做一个整理。
<!-- more -->

# 给新系统减肥
---
- 修改 terminal 配色、字体大小...
- 通过 Tweak 设置桌面显示图标（个人癖好）
- 删除无用软件（只是列举几个而已)
```sh
sudo apt-get remove unity-webapps-common thunderbird evolution
```
- 各种更新
```sh
sudo apt-get update
sudo apt-get install -f
sudo apt-get upgrade
sudo apt-get dist-upgrade
sudo apt-get autoremove
```
- 下载安装 Chrome，搜狗拼音输入法，vim，cgdb，git


# Terminal 配置
---

首先将我的 **[配置文件](https://github.com/Joouis/Joou-s-Config)** 克隆到电脑上，然后将里面的东西都复制到自己的用户目录下。如果没有使用 TMUX 软件则不必复制 .tmux.conf 文件。
```sh
cp .bashrc .vimrc .gitconfig .tmux.conf ~/.
cd ~
source .bashrc
```

## VIM 配置
1. 安装 VIM Plugin 管理插件 [Vundle](https://github.com/VundleVim/Vundle.vim)；

2. 进入 VIM 并输入`:VundleInstall`；

3. 使用 Pathogen 插件；
```sh
curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim
```
4. 安装 [xptemplate](https://github.com/drmingdrmer/xptemplate) 插件（自动补全功能）。直接将其项目克隆到家目录下的`.vim`文件夹中即可；
5. 安装 [ctags](http://ctags.sourceforge.net/)，下载源码编译即可，初始化直接在目录下进入 vim 按`ctrl & F12`，使用直接在代码上用`ctrl & ]`追踪，`ctrl & t`返回；
6. 安装 cscope，直接通过`apt-get`即可，初始化代码如下，使用上覆盖了 ctags 的操作，并且可以使用`ctrl & \ + s`查找当前光标所在符号出现过位置（更多指令请`man cscope`）；
```sh
cscope -Rbq -f <name>.out
# Enter vi
:cs add <name>.out
```

## 清除临时文件
以`.un~`结尾的临时文件还蛮讨厌的，像我个人有强迫症，看到就会想删掉，可以输入以下命令来打扫。
```sh
find . -name "*~" > ToBeClear.sh
chmod +x ToBeClear.sh
# Add rm to the head of ToBeClear.sh by vim, sort multi-lines to one line by "shift j"
./ToBeClear.sh
```
