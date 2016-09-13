---
layout: post
title:  "php-curl相关的一些用法和问题"
date:   2016-6-27 17:21
categories: skill
tags: php
---

>第三方登录库FACEBOOK接入问题,各种问题让人摸不到门

GFW不允许通过，设置CURL代理，代码如下  
<!-- more -->

>curl_setopt($ch,CURLOPT_PROXY,'127.0.0.1');  
curl_setopt($ch,CURLOPT_PROXYPORT,'8787');

入职一个月，学到什么了呢
1. 怎么接入paypal-php-sdk
2. 怎么申请paypal开发者账号，还有测试账号。
3. 怎么申请google,facebook,twitter的第三方登录
4. 怎么灵活运用TP3.2的国际化功能，来达到各个版本之间的灵活切换，而不影响功能
5. swiper框架的使用，wechat-jssdk的使用


下面是个人的一些想法，工作周例会时，头儿老是强调去研究api，然后自己编码，我觉得这个不是很必要。尽管这样会弱化(?)你的编码能力。
但是在我看来，这之中未必没有让你觉得受益的地方。
1. 让别人写的更融洽的结合到现有的环境，这需要一定的功力
2. 使用的过程中会接触的别人的代码，scan code，可以了解他人的设计思路，学习他人的编码技巧。
3. github上那么多的库，建库的目的是什么，就是为了便捷开发，节约成本，特别是对于一些国外的产品，同时你的英文水平有不甚高。这个时候当如何。找找歪国人写的api总是没错的，为什么，对api的理解很容易。这样可以减少出错的概率。

用curl传输文件，不同版本使用的方法不尽相同，下面就之前在开发中遇到的问题提供案例和解决方案
5.3的curl和5.6的curl
在5.6版本使用	`$fileData = array('userfile' => '@' . realpath($filePath));`绑定文件的话会有些数据漏掉导致传输文件不完整
这时应该使用CURLFile将文件包装一下


>if (class_exists('\CURLFile')) {  
	$fileData = array('userfile' => new \CURLFile(realpath($filePath)));  
} else {  
	$fileData = array('userfile' => '@' . realpath($filePath));  
}

linux的快捷方式创建方法`ln -s 源 快捷方式`