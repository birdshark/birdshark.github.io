---
layout: post
title:  "github-pages静态blog"
date:   2016-2-29 15:58:00
tags: markdown
categories: jekyll
---


>学而有术是谓兴,
>学而无术是无心.
>不学无术要不得,
>不学有术是神棍.


<!-- more -->

## __序__ ##
此番乃无聊之作。是以生之有命，而学不止也。

## __章__ ##
1. 什么是`github pages`
2. 系统环境搭建
3. 应用模板


## __节__ ##

### 一、什么是`github pages` ###

`github pages`是`github`为开发者们和开发者们托管在github上的Project而准备的一个平台,以至于开发者们可以介绍自己和自己的Project。
如果你想要创建个人的`github pages`，那么你就得在github上创建一个Project名为
`username.github.io`,其中`username`为你登陆github时所用的`username`
这个`username`必须要填写正确，否则github会将其判定为Project级别的`github pages`。

### 二、系统环境搭建 ###
为了调试更加方便，我们必须得在本地搭建一个运行的环境。方便调试，节省时间。

某的系统环境 `win7 x64`
`github pages`是基于`jekyll`的。那什么是`jekyll`呢?`jekyll`是`ruby`的一个服务器框架。所以要想玩这个要安装的东西很多。
某来列一列吧


>1. [ruby](https://www.ruby-lang.org/en/documentation/installation/)
2. [gem](https://rubygems.org/pages/download)
3. [gh-pages](https://github.com/github/pages-gem)

当然，对于很多人来说`jekyll`，是个陌生人。但是纵观现在诸多门编程语言，致用时都可以用MVC来概述。

本人是按照官方网站指导去做的，所遇问题有以下几点

>1. 无法用gem命令创建Gemfile
2. 由于之前安装过好多个版本的jekyll和其他的一些gh-page所依赖的库，导致jekyll build运行报错。
3. jekyll-paginate的使用

解法


>1. 未解
2. 运行`github-pages versions`查看依赖库，运行`gem list`查看本地以安装的库 两者对比，以`github-pages`为准，运行`gem uninstall 库名称`卸载冗余库
3. 在`_config.yml`里添加`gems: [jekyll-paginate]`之后 分页功能即可正常使用


### 三、应用模板 ###
个人感觉官方提供的`themes`,又少又薄弱对于css盲来说联想创作出一套适用的模板，当然jekyll的Blog模板还是很多的。只要你用[心](http://jekyllthemes.org/)去找。

## __结语__ ##
以上是本人的一些经验，和着一些通常之经验，得出之成果。
